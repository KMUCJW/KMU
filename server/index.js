const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3001;

// CORS 설정
app.use(cors({
  origin: '*', // 모든 도메인에서의 접근 허용
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// 업로드된 파일을 저장할 디렉토리 생성
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// 업로드된 파일 정보를 저장할 배열
let uploadedFiles = [];

// Multer 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // 파일명에 타임스탬프 추가하여 중복 방지
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// 파일 업로드 처리
app.post('/api/upload', upload.array('files'), (req, res) => {
  try {
    const files = req.files;
    const title = req.body.title;
    const description = req.body.description;
    const tags = JSON.parse(req.body.tags);

    // 업로드된 파일들의 정보를 저장
    const fileInfos = files.map(file => ({
      id: Date.now() + Math.round(Math.random() * 1E9),
      title,
      description,
      tags,
      filename: file.filename,
      originalname: file.originalname,
      path: file.path,
      size: file.size
    }));

    // 파일 정보를 배열에 추가
    uploadedFiles = [...uploadedFiles, ...fileInfos];

    // 응답
    res.json({
      success: true,
      message: 'Files uploaded successfully',
      data: {
        title,
        description,
        tags,
        files: fileInfos
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading files',
      error: error.message
    });
  }
});

// 업로드된 파일 목록 조회
app.get('/api/files', (req, res) => {
  try {
    res.json({
      success: true,
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching files',
      error: error.message
    });
  }
});

// 파일 상세 정보 조회
app.get('/api/files/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const file = uploadedFiles.find(f => f.id === id);
    
    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    res.json({
      success: true,
      file
    });
  } catch (error) {
    console.error('Error fetching file details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching file details',
      error: error.message
    });
  }
});

// 업로드된 파일 제공
app.use('/uploads', express.static(uploadDir));

// 서버 시작
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Local: http://localhost:${port}`);
  console.log(`Network: http://${getLocalIpAddress()}:${port}`);
});

// 로컬 IP 주소 가져오기
function getLocalIpAddress() {
  const { networkInterfaces } = require('os');
  const nets = networkInterfaces();
  
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // IPv4이고 내부 주소가 아닌 경우
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
} 
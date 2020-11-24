const path =  require("path");

const multer = require("multer");

// Middleware
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `./tmp`)
    },
    filename: function(req, file, cb){
        cb(null,file.originalname);
    }
});

export const upload_single = multer({
    storage: storage,
    limits:{fileSize: 1000000},
}).single("sourceFile");


export const upload_multi = multer({
    storage: storage,
    limits:{fileSize: 1000000},
}).any("sourceFile");

const fs = require( "fs" );
async function copyDir(from, to) {
  fs.mkdirSync(to);
  await fs.readdir(from, (err, paths) => {
    paths.forEach((path)=>{
      var src = `${from}/${path}`;
      var dist = `${to}/${path}`;
      fs.stat(src,(err, stat)=> {
        if(stat.isFile()) {
          fs.writeFileSync(dist, fs.readFileSync(src));
        } else if(stat.isDirectory()) {
          copyDir(src, dist);
        }
      });
    });
  });
}
module.exports = {
  copyDir
}

const { spawn } = require("child_process")

const all_Classes=['not_cyberbullying', 'gender', 'religion', 'other_cyberbullying', 'age', 'ethnicity']
const pyPr = spawn('python', ["Predict.py","nice ass"])

pyPr.stdout.on("data", data => {
    console.log(`from python ${parseInt(data.toString())}`);
})
 
pyPr.stderr.on("data", err => { 
    console.log("Python error ", err.toString())
})
pyPr.on("close ", (code) => {
    console.log("python program close with code : ", code.toString());
})
import { exec } from "child_process";

export default function doCommandLine(command, serviceName, call) {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.log(`[${serviceName}] error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`[${serviceName}] stderr: ${stderr}`);
      return;
    }
    console.log(`[${serviceName}] stdout: ${stdout}`);
    if (call) {
      call(stdout);
    }
  });
}

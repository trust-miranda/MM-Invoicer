import { exec } from "child_process";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const scriptPath = `"C:/Users/5033/OneDrive - Trust Gestão de Saúde S.A/Desktop/Controlo de Gestão/Projetos/repoAlteracoesAContratos/app/main.py"`;

  exec(`python ${scriptPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing script: ${error.message}`);
      console.error(`stderr: ${stderr}`);
      return res.status(500).json({ error: "Script execution failed" });
    }

    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);

    res
      .status(200)
      .json({ message: "Script executed successfully", stdout, stderr });
  });
}

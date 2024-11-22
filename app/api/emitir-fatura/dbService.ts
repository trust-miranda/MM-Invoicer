import sql from "mssql";

const sqlConfig = {
  user: "5033",
  password: "manel123456",
  server: "192.168.1.240",
  database: "PHC",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

export async function handleValidationAndInsertInvoice(invoiceDetails) {
  let pool;
  try {
    pool = await sql.connect(sqlConfig);

    // // Step 1: Execute the SELECT query
    // const preSelectResult = await pool.request().query(`
    //     SELECT pd.idprocesso
    //     FROM preDataset pd
    //     JOIN processoclinico pc ON pd.idprocesso = pc.idprocesso
    //     LEFT JOIN PHC..ft ft ON ft.anulado = '0'
    //         AND ft.ndoc NOT IN ('76', '46','42', '62','61','53', '44')
    //         AND ft.tipodoc = '1'
    //         AND YEAR(ft.fdata) >= '2023'
    //         AND CAST(pc.idprocesso AS varchar) = LTRIM(RTRIM(ft.u_sinistro))
    //     WHERE pd.processoFaturado = 0
    //       AND ft.u_sinistro IS NOT NULL;
    //   `);

    // // Step 2: If records are found, update the preDataset table
    // if (preSelectResult.recordset.length > 0) {
    //   for (const record of preSelectResult.recordset) {
    //     await pool.request().input("idProcesso", sql.VarChar, record.idprocesso)
    //       .query(`
    //           UPDATE preDataset
    //           SET processoFaturado = '1', ultimaAtualizacao = GETDATE()
    //           WHERE idProcesso = @idProcesso;
    //         `);
    //   }
    // }

    // // Step 3: Validate if there is an existing record for the idProcesso
    // const validationResult = await pool
    //   .request()
    //   .input("idProcesso", sql.VarChar, invoiceDetails.idProcesso).query(`
    //     SELECT DISTINCT pd.idProcesso
    //     FROM preDataset pd
    //     LEFT JOIN PHC..ft ft ON ft.anulado = '0'
    //       AND pd.idProcesso = @idProcesso
    //       AND ft.ndoc NOT IN ('76', '46','42', '62','61','53', '44')
    //       AND ft.tipodoc = '1'
    //       AND YEAR(ft.fdata) >= '2023'
    //       AND CAST(@idProcesso AS varchar) = LTRIM(RTRIM(ft.u_sinistro))
    //     WHERE pd.processoFaturado = 1
    //       AND ft.u_sinistro IS NOT NULL;
    //   `);
    // // Step 4: If records are found, warn the user
    // if (validationResult.recordset.length > 0) {
    //   await pool.close();
    //   return {
    //     warning: true,
    //     message: `An invoice has already been issued for idProcesso: ${invoiceDetails.idProcesso}`,
    //   };
    // }

    // Step 5: Insert the invoice details
    const updateResult = await pool
      .request()
      .input("chave", sql.VarChar, invoiceDetails.chave)
      .input("ftstamp", sql.VarChar, invoiceDetails.ftstamp)
      .input("fistamp", sql.VarChar, invoiceDetails.fistamp)
      .input("dataFatura", sql.DateTime, invoiceDetails.dataFatura)
      .input("nrFatura", sql.Int, invoiceDetails.nrFatura)
      .input("idProcesso", sql.VarChar, invoiceDetails.idProcesso)
      .input("nrCliente", sql.Int, invoiceDetails.nrCliente)
      .input("cliente", sql.NVarChar, invoiceDetails.cliente)
      .input("ref", sql.VarChar, invoiceDetails.ref)
      .input("descricao", sql.VarChar, invoiceDetails.descricao)
      .input("qtt", sql.Int, invoiceDetails.qtt)
      .input("valorUnit", sql.Int, invoiceDetails.valorUnit)
      .input("u_facturatmpstamp", sql.VarChar, invoiceDetails.u_facturatmpstamp)
      .input("bistamp", sql.VarChar, invoiceDetails.bistamp)
      .input("idRequisicao", sql.VarChar, invoiceDetails.idRequisicao)
      .input("estado", sql.VarChar, invoiceDetails.estado);

    // Step 7: Perform the additional updates
    await pool.request().input("bistamp", sql.VarChar, invoiceDetails.bistamp)
      .query(`
        UPDATE bi
        SET u_vendida = '1'
        WHERE bistamp = @bistamp;
      `);

    await pool
      .request()
      .input("u_facturatmpstamp", sql.VarChar, invoiceDetails.u_facturatmpstamp)
      .query(`
        UPDATE u_facturatmp
        SET facturado = '1', dfacturacao = GETDATE()
        WHERE u_facturatmpstamp = @u_facturatmpstamp;
      `);

    return {
      success: true,
      rowsUpdated: updateResult.rowsAffected,
    };
  } catch (error) {
    throw new Error(`Database operation failed: ${error.message}`);
  } finally {
    if (pool) {
      await pool.close(); // Ensure the connection is closed
    }
  }
}

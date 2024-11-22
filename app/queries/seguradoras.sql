SELECT cl.nome, LTRIM(RTRIM(UPPER(cl.nome2))) as Seguradora, cl.no, cl.u_noportal
FROM cl WITH (NOLOCK)
WHERE cl.no IN ('9','12','394','111','246','252','325','477','1413','3742')
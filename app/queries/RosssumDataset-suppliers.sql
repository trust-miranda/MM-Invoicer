SELECT LTRIM(RTRIM(fl.nome)) as supplierFullName,
    LTRIM(RTRIM(fl.nome2)) as supplierShortName,
    LTRIM(RTRIM(fl.ncont)) as vatNumber,
    CAST(fl.no AS INT) as supplierId,
    CAST(fl.estab AS INT) as establishmentId,
    LTRIM(RTRIM(fl.u_distrito)) as district
FROM fl WITH (NOLOCK)
WHERE fl.tipo='Prestador de Rede'
    AND fl.inactivo='0'

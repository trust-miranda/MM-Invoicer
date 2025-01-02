SELECT CAST(fo.no as INT) as supplierId, CAST(fo.estab as INT) as establishmentId, LTRIM(RTRIM(fo.adoc)) as documentId
FROM fo WITH (NOLOCK)
WHERE YEAR(fo.data)>= '2022'

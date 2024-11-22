SELECT LTRIM(RTRIM(st.ststamp)) as ststamp, LTRIM(RTRIM(st.ref)) as codigo, LTRIM(RTRIM(sc.refb)) as codigoProdutoComposto, LTRIM(RTRIM(st.design)) as Descricao
FROM st WITH (NOLOCK)
LEFT JOIN sc WITH (NOLOCK) ON st.ref = sc.ref
WHERE st.inactivo='0'
UNION ALL
SELECT LTRIM(RTRIM(sc.ststamp)) as ststamp, LTRIM(RTRIM(sc.refb)) as codigo, LTRIM(RTRIM(sc.refb)) as codigoProdutoComposto, LTRIM(RTRIM(sc.design)) as Descricao
FROM st WITH (NOLOCK)
LEFT JOIN sc WITH (NOLOCK) ON st.ststamp = sc.ststamp
WHERE st.inactivo='0'
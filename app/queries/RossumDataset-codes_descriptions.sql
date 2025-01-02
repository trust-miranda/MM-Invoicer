SELECT *
FROM
    (SELECT LTRIM(RTRIM(sc.refb)) as bundledCode, LTRIM(RTRIM(st.ref)) as code, LTRIM(RTRIM(st.design)) as description
    FROM st WITH (NOLOCK)
        LEFT JOIN sc WITH (NOLOCK) ON st.ref=sc.ref
            AND st.inactivo='0') dataset
WHERE dataset.bundledCode IS NOT NULL
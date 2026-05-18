
export const getService = async () => {
    const res = await fetch('https://woodly-server-fayw.vercel.app/orders')
    const data = res.json()
    return data;
}

  
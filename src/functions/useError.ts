import React from 'react'

interface Error {
    error: string,
    message: string
}

const useError = () => {
    const [error, setError] = React.useState<Error>({ error: '', message: '' })

    return { error, setError }
}

export default useError
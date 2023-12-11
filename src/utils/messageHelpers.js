export const errorMessage = (message) => {
    return (
        <p>{message}</p>
    )
}

export const successMessage = () => {
    return (
        <div style={{display: "none"}} >
            <p>Formulario enviado com sucesso</p>
        </div>
    )
}
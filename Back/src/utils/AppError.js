class AppError {
    constructor(messagem, statusErro = 400){
        this.messagem = messagem;
        this.statusErro = statusErro;
    }
};

export { AppError };
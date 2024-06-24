export class ValidateMiddleware {
    constructor(ClassValidationDto) {
        this.ClassValidationDto = ClassValidationDto;
    }

    execute({body}, res, next) {
        const dto = new this.ClassValidationDto(body);
        dto.validate(next);
        next();
    }
}
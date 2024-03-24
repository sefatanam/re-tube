import { FormControl } from '@angular/forms';
import { youtubeUrlValidator } from '../youtube.validators';

describe('YoutubeUrlValidator', () => {
    it('should return null for a valid YouTube URL', () => {
        const validator = youtubeUrlValidator();
        const control = new FormControl('https://youtu.be/LB8KwiiUGy0');

        const result = validator(control);

        expect(result).toBeNull();
    });

    it('should return { pattern: true } for an invalid YouTube URL', () => {
        const validator = youtubeUrlValidator();
        const control = new FormControl('invalid-url');

        const result = validator(control);

        expect(result).toEqual({ pattern: true });
    });

    it('should return null for an empty value', () => {
        const validator = youtubeUrlValidator();
        const control = new FormControl('');

        const result = validator(control);

        expect(result).toBeNull();
    });

    it('should return null for null control value', () => {
        const validator = youtubeUrlValidator();
        const control = new FormControl(null);
        const result = validator(control);
        expect(result).toBeNull();
    });
})
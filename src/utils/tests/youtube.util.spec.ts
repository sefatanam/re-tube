import { YoutubeUtil } from "@utils/youtube.util"
import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from "@angular/platform-browser";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IdTokenResult, User } from "firebase/auth";

const URL_OBJECT = {
    href: 'https://youtu.be/LB8KwiiUGy0',
    extractedId: 'LB8KwiiUGy0'
}

const QUERYPARAM_OBJECT = {
    href: 'https://re-tube.vercel.app/share-target?title=Node.js: The Documentary | An origin story&text=https://youtube.com/watch?v=LB8KwiiUGy0&si=sMlkfRngzYRcEV3m',
    extractedId: 'LB8KwiiUGy0'
}

let MOCK_USER: User = {
    emailVerified: false,
    isAnonymous: false,
    metadata: {},
    providerData: [],
    refreshToken: "",
    tenantId: null,
    delete: function (): Promise<void> {
        throw new Error("Function not implemented.");
    },
    getIdToken: function (forceRefresh?: boolean | undefined): Promise<string> {
        throw new Error("Function not implemented.");
    },
    getIdTokenResult: function (forceRefresh?: boolean | undefined): Promise<IdTokenResult> {
        throw new Error("Function not implemented.");
    },
    reload: function (): Promise<void> {
        throw new Error("Function not implemented.");
    },
    toJSON: function (): object {
        throw new Error("Function not implemented.");
    },
    displayName: null,
    email: null,
    phoneNumber: null,
    photoURL: null,
    providerId: "",
    uid: ""
};

describe('YoutubeUtil', () => {

    let util: YoutubeUtil;
    let sanitizerMock: DomSanitizer;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [FormBuilder]
        });
        util = await TestBed.inject(YoutubeUtil);
        sanitizerMock = await TestBed.inject(DomSanitizer);
    })

    it('should be created', () => {
        expect(util).toBeTruthy();
    });

    describe('Extract YouTube videoId tests', () => {
        it('should extract video id from youtube url', () => {
            const result = util.extractYouTubeVideoId(URL_OBJECT.href);
            expect(result).toBe(URL_OBJECT.extractedId);
        });

        it('should be throw an error for invalid url', () => {
            const errorMessage = 'Video URL not able to parse.';
            expect(() => util.extractYouTubeVideoId('https://youtu.be/'))
                .toThrowError(errorMessage);
        });

    })

    describe('Extract youtube videoid from shared link tests', () => {
        it('shoud extract the videoId', () => {
            const result = util.extractYouTubeVideoIdFromSharedLink(QUERYPARAM_OBJECT.href);
            expect(result).toBe(QUERYPARAM_OBJECT.extractedId);
        })

        it('should be throw error', () => {
            const errorMessage = 'Video URL not able to parse.';
            expect(() => util.extractYouTubeVideoIdFromSharedLink('https://youtube.com?title=&text='))
                .toThrowError(errorMessage)
        })
    })

    describe('Convert safe youtube url', () => {
        it('should generate a safe YouTube URL with autoplay enabled', () => {
            const videoId = 'LB8KwiiUGy0';
            const expectedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            const result = util.convertSafeYoutubeUrl(videoId);
            expect(result).toBeTruthy();
            expect(result).toEqual(sanitizerMock.bypassSecurityTrustResourceUrl(expectedUrl))
        });
    });

    describe('Get valid video info from form', () => {
        it('should return invalid status when form is invalid', async () => {
            const formBuilder = TestBed.inject(FormBuilder);
            const formGroup: FormGroup = formBuilder.group({
                title: ['', Validators.required],
                videoId: ['VIDEO_ID', Validators.required]
            });
            formGroup.markAllAsTouched(); // Mark form as invalid

            const result = await util.getValidVideoInfoFromForm(formGroup, MOCK_USER);
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Form is not valid');
            expect(result.data).toBeNull();
        });

        it('should return invalid status when createVideoInfo returns false', async () => {
            const formBuilder = TestBed.inject(FormBuilder);
            const formGroup: FormGroup = formBuilder.group({
                title: ['Title', Validators.required],
                videoId: ['Invalid Video ID', Validators.required]
            });

            const result = await util.getValidVideoInfoFromForm(formGroup, MOCK_USER);

            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Something went wrong!.');
            expect(result.data).toBeNull();
        });

        it('should return valid status with video info when form is valid', async () => {
            const VIDEO_URL = URL_OBJECT.href;
            const formBuilder = TestBed.inject(FormBuilder);
            const formGroup: FormGroup = formBuilder.group({
                title: ['Title', Validators.required],
                videoId: [VIDEO_URL, Validators.required]
            });

            formGroup.markAllAsTouched();

            const VALID_USER = { ...MOCK_USER, uid: '123', displayName: 'ABC' }
            const result = await util.getValidVideoInfoFromForm(formGroup, VALID_USER);

            expect(result.isValid).toBe(true);
            expect(result.error).toBeNull();
            expect(result.data).toEqual({
                videoId: URL_OBJECT.extractedId,
                title: 'Title',
                userId: VALID_USER.uid,
                userName: VALID_USER.displayName
            });
        });

        it('should occured error with invalid video url', async () => {
            const VIDEO_URL = 'https://youtube.be/';
            const formBuilder = TestBed.inject(FormBuilder);
            const formGroup: FormGroup = formBuilder.group({
                title: ['Title', Validators.required],
                videoId: [VIDEO_URL, Validators.required]
            });

            formGroup.markAllAsTouched();

            const VALID_USER = { ...MOCK_USER, uid: '123', displayName: 'ABC' };
            const result = await util.getValidVideoInfoFromForm(formGroup, VALID_USER);

            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Error: Video URL not able to parse.');
            expect(result.data).toBeNull();
        });
    });


})
const path = require('path');
const fs = require('fs/promises');
const xlsx = require('xlsx');
const { generateExcel } = require('./pack');

jest.mock('fs/promises', () => ({
    mkdir: jest.fn(),
}));

jest.mock('xlsx');

describe('generateExcel', () => {
    const outputDir = 'testDir';
    const locales = 'zh';
    const mockTranslations = { hello: '你好', goodbye: '再见' };
    const mockTranslationsPath = path.resolve(__dirname, 'testDir', `${locales}.js`);

    beforeEach(() => {
        jest.clearAllMocks();
        // Mock require to return mock translations
        jest.doMock(mockTranslationsPath, () => mockTranslations);
    });

    it('should create the output directory and generate an Excel file', async () => {
        // Mock the fs.mkdir
        fs.mkdir.mockResolvedValue();

        await generateExcel(outputDir, locales);

        expect(fs.mkdir).toHaveBeenCalledWith(outputDir, { recursive: true });
        expect(xlsx.utils.book_new).toHaveBeenCalled();
        expect(xlsx.utils.aoa_to_sheet).toHaveBeenCalledWith([
            ['key', locales],
            ...Object.entries(mockTranslations),
        ]);
        expect(xlsx.utils.book_append_sheet).toHaveBeenCalled();
        expect(xlsx.writeFile).toHaveBeenCalledWith(expect.anything(), path.join(outputDir, `${locales}.xlsx`));
    });
});

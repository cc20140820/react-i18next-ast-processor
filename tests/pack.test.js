const fs = require('fs/promises');
const path = require('path');
const xlsx = require('xlsx');
const { generateExcel } = require('../pack.js');
jest.mock('fs/promises');
jest.mock('path');
jest.mock('xlsx');

describe('generateExcel function', () => {
    const mockLanguageJsFilePath = 'mockOutputDir/zh.js';
    const mockTranslations = {
        hello: '你好'
    };
    const outputDir = 'testOutputDir';
    const locales = 'zh';

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create the output directory successfully', async () => {

        // 模拟fs.mkdir成功
        fs.mkdir.mockResolvedValueOnce();

        // 模拟path.join的返回值
        path.join.mockReturnValue(mockLanguageJsFilePath);

        // 模拟require读取文件成功，这里返回一个示例的translations对象
        jest.mock(mockLanguageJsFilePath, () => mockTranslations, { virtual: true });

        // 模拟xlsx相关函数的调用
        const mockWorkbook = {};
        xlsx.utils.book_new.mockReturnValue(mockWorkbook);
        const mockWorksheet = {};
        xlsx.utils.aoa_to_sheet.mockReturnValue(mockWorksheet);
        xlsx.utils.book_append_sheet.mockResolvedValueOnce();
        xlsx.writeFile.mockResolvedValueOnce();

        await generateExcel(outputDir, locales);

        expect(fs.mkdir).toHaveBeenCalledWith(outputDir, { recursive: true });
        expect(path.join).toHaveBeenCalledWith(outputDir, `${locales}.js`);
        expect(require(path.join(outputDir, `${locales}.js`))).toEqual(mockTranslations);

        // 检查xlsx相关函数的调用情况
        expect(xlsx.utils.book_new).toHaveBeenCalled();
        expect(xlsx.utils.aoa_to_sheet).toHaveBeenCalledWith([
            ['key', locales],
            ...Object.entries(mockTranslations)
        ]);
        expect(xlsx.writeFile).toHaveBeenCalledWith(mockWorkbook, path.join(outputDir, `${locales}.xlsx`));
    })
});
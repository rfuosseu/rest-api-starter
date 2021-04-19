const config = {
    verbose: true,
    rootDir: 'src',
    moduleFileExtensions: ['ts', 'js', 'json', 'tx', 'jx', 'node'],
    coverageDirectory: '../coverage',
    transform: {
        '\\.ts$': 'ts-jest'
    }
};
export default config;

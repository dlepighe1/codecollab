import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import type { Extension } from '@codemirror/state';

export const LANGUAGE_MAP: Record<string, {
    ext: string;
    piston: string;
    codemirror: () => Extension[];
    defaultContent: string;
}> = {
    'javascript': {
        ext: 'js', piston: 'javascript',
        codemirror: () => [javascript()],
        defaultContent: 'console.log("Hello CodeCollab!");'
    },
    'typescript': {
        ext: 'ts', piston: 'typescript',
        codemirror: () => [javascript({ typescript: true })],
        defaultContent: 'const msg: string = "Hello CodeCollab!";\nconsole.log(msg);'
    },
    'python': {
        ext: 'py', piston: 'python',
        codemirror: () => [python()],
        defaultContent: 'print("Hello CodeCollab!")'
    },
    'java': {
        ext: 'java', piston: 'java',
        codemirror: () => [java()],
        defaultContent: 'public class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello CodeCollab!");\n\t}\n}'
    },
    'cpp': {
        ext: 'cpp', piston: 'c++',
        codemirror: () => [cpp()],
        defaultContent: '#include <iostream>\n\nint main() {\n\tstd::cout << "Hello CodeCollab!" << std::endl;\n\treturn 0;\n}'
    },
    'go': {
        ext: 'go', piston: 'go',
        codemirror: () => [],
        defaultContent: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("Hello CodeCollab!")\n}'
    }
};

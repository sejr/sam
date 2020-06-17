import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import code from '@/assets/code';

interface CodeBlockProps {
    value: string;
    language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ value, language }) => (
    <SyntaxHighlighter language={language} style={code} useInlineStyles={false}>
        {value}
    </SyntaxHighlighter>
);

export default CodeBlock;

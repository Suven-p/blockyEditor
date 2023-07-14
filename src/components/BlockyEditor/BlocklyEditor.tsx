import React, { useRef, useState } from 'react';

import { WorkspaceSvg, useBlocklyWorkspace } from 'react-blockly';
import ConfigFiles from 'react-blockly/dist/initContent/content';
import { ToolboxInfo } from 'blockly/core/utils/toolbox';
import { javascriptGenerator } from 'blockly/javascript';
import { pythonGenerator } from 'blockly/python';
import { dartGenerator } from 'blockly/dart';

const TestEditor = () => {
    const onWorkspaceChange = (workspace: WorkspaceSvg) => {
        workspace.registerButtonCallback('myFirstButtonPressed', () => {
            alert('button is pressed');
        });
        const code = languageGenerator.workspaceToCode(workspace);
        setGeneratedCode(code);
    };

    const [toolboxConfiguration, setToolboxConfiguration] =
        React.useState<ToolboxInfo>(ConfigFiles.INITIAL_TOOLBOX_JSON);
    const [generatedCode, setGeneratedCode] = useState('');
    const [languageGenerator, setLanguageGenerator] =
        useState<any>(javascriptGenerator);
    const blocklyRef = useRef(null);
    const { workspace } = useBlocklyWorkspace({
        ref: blocklyRef,
        toolboxConfiguration: toolboxConfiguration,
        workspaceConfiguration: {
            grid: {
                spacing: 20,
                length: 3,
                colour: '#ccc',
                snap: true,
            },
        },
        initialXml: ConfigFiles.INITIAL_XML,
        // initialJson:ConfigFiles.INITIAL_JSON,
        // className:'fill-height',
        onWorkspaceChange: onWorkspaceChange,
    });

    const languages: Record<string, any> = {
        Javascript: javascriptGenerator,
        Python: pythonGenerator,
        Dart: dartGenerator,
    };
    const onLanguageChangeHandler: React.ChangeEventHandler<
        HTMLSelectElement
    > = (event) => {
        const language = event.target.value;
        const newGenerator = languages[language];
        setLanguageGenerator(newGenerator);
    };

    React.useEffect(() => {
        const code = languageGenerator.workspaceToCode(workspace);
        setGeneratedCode(code);
    }, [languageGenerator]);

    React.useEffect(() => {
        window.setTimeout(() => {
            setToolboxConfiguration((prevConfig: ToolboxInfo) => ({
                ...prevConfig,
                contents: [
                    ...prevConfig.contents,
                    {
                        kind: 'category',
                        name: 'Dynamically added category',
                        contents: [
                            { kind: 'block', type: 'text' },
                            {
                                kind: 'block',
                                blockxml:
                                    '<block type="text_print"><value name="TEXT"><shadow type="text">abc</shadow></value></block>',
                            },
                        ],
                    },
                ],
            }));
        }, 2000);

        window.setTimeout(() => {
            setToolboxConfiguration((prevConfig: ToolboxInfo) => ({
                ...prevConfig,
                contents: [
                    ...prevConfig.contents.slice(
                        0,
                        prevConfig.contents.length - 1
                    ),
                    {
                        ...prevConfig.contents[prevConfig.contents.length - 1],
                        contents: [{ kind: 'block', type: 'text' }],
                    },
                ],
            }));
        }, 4000);

        window.setTimeout(() => {
            setToolboxConfiguration((prevConfig: ToolboxInfo) => ({
                ...prevConfig,
                contents: [
                    ...prevConfig.contents.slice(
                        0,
                        prevConfig.contents.length - 1
                    ),
                ],
            }));
        }, 10000);
    }, []);

    return (
        <>
            <label htmlFor='language'>Choose a language:</label>
            <select onChange={onLanguageChangeHandler} id='language'>
                {Object.keys(languages).map((language) => {
                    return <option key={language}>{language}</option>;
                })}
            </select>

            <div ref={blocklyRef} style={{ width: '80%', height: '300px' }} />
            <textarea
                style={{ height: '200px', width: '400px' }}
                value={generatedCode}
                readOnly
            />
        </>
    );
};

export default TestEditor;

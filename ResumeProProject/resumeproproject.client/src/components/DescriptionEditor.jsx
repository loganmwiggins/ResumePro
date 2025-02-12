import React, { useEffect, useState } from 'react';
import RichTextEditor from 'react-rte';

import '../stylesheets/DescriptionEditor.css';

function DescriptionEditor({ value, handleChange, placeholder }) {
    // Ensure value is initialized properly when passed back
    const [editorValue, setEditorValue] = useState(
        value ? RichTextEditor.createValueFromString(value, "html") : 
        RichTextEditor.createEmptyValue()
    );

    // Ensure the state updates when the prop value changes, but prevent stae reset while user is typing
    useEffect(() => {
        if (value !== editorValue.toString("html")) {
            setEditorValue(RichTextEditor.createValueFromString(value, "html"));
        }
    }, [value]);

    const onChange = (newValue) => {
        setEditorValue(newValue);   // Update local state
        handleChange(newValue.toString("html"));    // Pass updated HTML back
    }

    return (
        <>
            <RichTextEditor value={editorValue} onChange={onChange} placeholder={placeholder} />
        </>
    )
}

export default DescriptionEditor;
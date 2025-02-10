import React from "react";
import { Document, Text, render, Page, View } from "redocx";

class ResumeDoc extends React.Component {
    render() {
        return (
            <Document>
                <Page>
                    <View>
                        <Text style={{ fontSize: 24, fontWeight: "bold" }}>
                            John Doe's Resume
                        </Text>
                        <Text>Email: john.doe@example.com</Text>
                        <Text>Phone: (123) 456-7890</Text>
                        <Text>Website: johndoe.com</Text>
                        <Text>LinkedIn: linkedin.com/in/johndoe</Text>
                    </View>
                </Page>
            </Document>
        );
    }
}

// Render the document
render(<ResumeDoc />, "resume.docx");

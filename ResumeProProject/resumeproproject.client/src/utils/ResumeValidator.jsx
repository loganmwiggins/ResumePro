import { showToast } from "./Toast";

export const validateResume = (data) => {
    let errors = [];
    
    // Helper function to check fields and store missing ones
    const checkField = (value, fieldName, section) => {
        if (!value || value.trim() === "") {
            errors.push({ fieldName, section });
        }
    };

    // Helper function to validate date order
    const validateDates = (startDate, endDate, section, index) => {
        if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
            errors.push({
                fieldName: `End Date must be after Start Date [${section}] - Entry ${index + 1}`,
                section
            });
        }
    };

    // General Information
    checkField(data.generalInformation.firstName, "First Name", "General Information");
    checkField(data.generalInformation.lastName, "Last Name", "General Information");

    // Experience Section
    if (data.experiences.length > 0) {
        data.experiences.forEach((exp, index) => {
            checkField(exp.companyName, `Company/Employer [${index + 1}]`, "Experience");
            checkField(exp.role, `Job Title [${index + 1}]`, "Experience");
            checkField(exp.startDate, `Start Date [${index + 1}]`, "Experience");
            checkField(exp.description, `Description [${index + 1}]`, "Experience");

            validateDates(exp.startDate, exp.endDate, "Experience", index);
        });
    }

    // Education Section
    if (data.educations.length > 0) {
        data.educations.forEach((edu, index) => {
            checkField(edu.schoolName, `School/University [${index + 1}]`, "Education");
            checkField(edu.degreeType, `Degree Type [${index + 1}]`, "Education");
            checkField(edu.major, `Major [${index + 1}]`, "Education");
            checkField(edu.startDate, `Start Date [${index + 1}]`, "Education");
            checkField(edu.endDate, `End Date [${index + 1}]`, "Education");

            validateDates(edu.startDate, edu.endDate, "Education", index);
        });
    }

    // Certifications Section
    if (data.certifications.length > 0) {
        data.certifications.forEach((cert, index) => {
            checkField(cert.name, `Name [${index + 1}]`, "Certifications");
            checkField(cert.issuer, `Issuer [${index + 1}]`, "Certifications");
            checkField(cert.issueDate, `Issue Date [${index + 1}]`, "Certifications");
            validateDates(cert.issueDate,cert.expireDate,"Certifications",index)
        });
    }

    // Projects Section
    if (data.projects.length > 0) {
        data.projects.forEach((proj, index) => {
            checkField(proj.title, `Title [${index + 1}]`, "Projects");
            checkField(proj.startDate, `Start Date [${index + 1}]`, "Projects");
            checkField(proj.description, `Description [${index + 1}]`, "Projects");

            validateDates(proj.startDate, proj.endDate, "Projects", index);
        });
    }

    // If there are errors, display grouped toasts per section
    if (errors.length > 0) {
        const groupedErrors = errors.reduce((acc, { fieldName, section }) => {
            if (!acc[section]) acc[section] = [];
            acc[section].push(fieldName);
            return acc;
        }, {});

        Object.entries(groupedErrors).forEach(([section, fields]) => {
            showToast(`${fields.join(", ")} field(s) required`, "warning", `${section} fields missing`);
        });

        return false; // Resume is invalid
    }

    return true; // Resume is valid
};
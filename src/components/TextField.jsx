import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';

export const TextField = ({ formik, fieldName, label, type = 'text', disabled = false }) => (
    <div className="mb-4">
        <FloatLabel>
            <InputText
                id={fieldName}
                name={fieldName}
                type={type}
                value={formik.values[fieldName]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={disabled}
                className={`w-full min-h-10 pl-4 border ${formik.touched[fieldName] && formik.errors[fieldName] ? 'p-invalid' : 'border-gray-300'}`}
            />
            <label htmlFor={fieldName}>{label}</label>
        </FloatLabel>
        {formik.touched[fieldName] && formik.errors[fieldName] && (
            <small className="p-error">{formik.errors[fieldName]}</small>
        )}
    </div>
);

export const DateField = ({ formik, fieldName, label }) => (
    <div className="mb-4">
        <FloatLabel>
            <Calendar
                id={fieldName}
                name={fieldName}
                value={formik.values[fieldName]}
                onChange={(e) => formik.setFieldValue(fieldName, e.value)}
                dateFormat="dd/mm/yy"
                showIcon
                className={`w-full min-h-10 pl-4 border rounded-lg ${formik.touched[fieldName] && formik.errors[fieldName] ? 'p-invalid' : ' border-gray-300'}`}
            />
            <label htmlFor={fieldName}>{label}</label>
        </FloatLabel>
        {formik.touched[fieldName] && formik.errors[fieldName] && (
            <small className="p-error">{formik.errors[fieldName]}</small>
        )}
    </div>
);
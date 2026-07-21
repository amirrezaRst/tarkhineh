import OtpInput from 'react-otp-input';

const OtpField = ({ value, setValue, error }) => {
    return (
        <>
            <OtpInput
                value={value}
                onChange={(newValue) => setValue(parseInt(newValue, 10))}
                numInputs={5}
                renderInput={(props) => <input {...props} />}
                containerStyle={{
                    display: 'flex',
                    flexFlow: "row-reverse",
                    justifyContent: 'space-between',
                    gap: '10px',
                    marginTop: "20px",
                }}
                inputStyle={{
                    width: '60px',
                    height: '50px',
                    border: `1px solid hsl(var(--muted-fg))`,
                    color: 'hsl(var(--foreground))',
                    borderRadius: '8px',
                    textAlign: 'center',
                }}
            />
            <span className="text-red-600 block text-sm mt-1.5">{error.message}</span>
        </>
    );
}

export default OtpField;
import React from 'react'
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import BasicDetails from '../components/BasicDetails';
import StepContent from '@material-ui/core/StepContent';
import Paper from '@material-ui/core/Paper';
import styles from './../styles/StepForm.module.scss'
import ProjectMedia from '../components/ProjectMedia';
import DetailedAnalysis from '../components/DetailedAnalysis';
import ProjectSites from '../components/ProjectSites';
import ProjectSpending from '../components/ProjectSpending';

function getSteps() {
    return ['Basic Details', 'Project Media', 'Detailed Analysis', 'Project Sites', 'Project Spending'];
}



export default function ManageProjects() {
    const [activeStep, setActiveStep] = React.useState(0);
    const steps = getSteps();

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    function getStepContent(step: number) {
        switch (step) {
            case 0:
                return <BasicDetails handleNext={handleNext} />;
            case 1:
                return <ProjectMedia handleNext={handleNext} handleBack={handleBack} />;
            case 2:
                return <DetailedAnalysis handleNext={handleNext} handleBack={handleBack} />;
            case 3:
                return <ProjectSites handleNext={handleNext} handleBack={handleBack} />;
            case 4:
                return <ProjectSpending handleNext={handleNext} handleBack={handleBack} />;
            default:
                return 'Unknown step';
        }
    }

    return (
        <div className={styles.mainContainer}>
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepLabel onClick={()=>setActiveStep(index)}>{label}</StepLabel>
                        <StepContent>
                            {getStepContent(index)}
                            {/* <div>
                                <div className={styles.formField}>
                                    <Button
                                        disabled={activeStep === 0}
                                        onClick={handleBack}
                                    >
                                        Back
                                    </Button>
                                    <AnimatedButton
                                        onClick={handleNext}
                                        className={styles.continueButton}
                                    >
                                        {activeStep === steps.length - 1 ? 'Finish' : 'Save and Continue'}
                                    </AnimatedButton>
                                </div>
                            </div> */}
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
            {activeStep === steps.length && (
                <Paper square elevation={0}>
                    <Typography>All steps completed - you&apos;re finished</Typography>
                    <Button onClick={handleReset}>
                        Reset
                    </Button>
                </Paper>
            )}

        </div>
    );
}
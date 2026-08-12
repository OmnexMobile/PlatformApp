
import { COLORS } from 'constants/theme-constants';
import { showMessage } from 'react-native-flash-message';
// d2 constants
const d2Table = {
    2: 1.128,
    3: 1.693,
    4: 2.059,
    5: 2.326,
    6: 2.534,
    7: 2.704,
    8: 2.847,
    9: 2.97,
    10: 3.078,
};

export const calculateCapability = ({ sampleSize, sampleList, lowerSpecLimit, upperSpecLimit }) => {
    if (!d2Table[sampleSize]) {
        throw new Error('Unsupported sample size');
    }

    if (sampleList.length % sampleSize !== 0) {
        throw new Error('Sample list length should be multiple of sample size.');
    }

    // ------------------------
    // Overall Mean
    // ------------------------

    const mean = sampleList.reduce((a, b) => a + b, 0) / sampleList.length;

    // ------------------------
    // Overall Std Dev (Pp/Ppk)
    // ------------------------

    const overallVariance =
        sampleList.reduce((sum, value) => {
            return sum + Math.pow(value - mean, 2);
        }, 0) /
        (sampleList.length - 1);

    const overallSigma = Math.sqrt(overallVariance);

    // ------------------------
    // Subgroups
    // ------------------------

    const groups = [];

    for (let i = 0; i < sampleList.length; i += sampleSize) {
        groups.push(sampleList.slice(i, i + sampleSize));
    }

    // ------------------------
    // Average Range
    // ------------------------

    const ranges = groups.map(group => {
        return Math.max(...group) - Math.min(...group);
    });

    const avgRange = ranges.reduce((a, b) => a + b, 0) / ranges.length;

    // ------------------------
    // Within Sigma
    // ------------------------

    const withinSigma = avgRange / d2Table[sampleSize];

    // ------------------------
    // Cp
    // ------------------------

    const cp = (upperSpecLimit - lowerSpecLimit) / (6 * withinSigma);

    // ------------------------
    // Cpu / Cpl
    // ------------------------

    const cpu = (upperSpecLimit - mean) / (3 * withinSigma);

    const cpl = (mean - lowerSpecLimit) / (3 * withinSigma);

    const cpk = Math.min(cpu, cpl);

    // ------------------------
    // Pp
    // ------------------------

    const pp = (upperSpecLimit - lowerSpecLimit) / (6 * overallSigma);

    // ------------------------
    // Ppu / Ppl
    // ------------------------

    const ppu = (upperSpecLimit - mean) / (3 * overallSigma);

    const ppl = (mean - lowerSpecLimit) / (3 * overallSigma);

    const ppk = Math.min(ppu, ppl);

    return {
        mean,
        overallSigma,
        withinSigma,
        cp,
        cpk,
        pp,
        ppk,
        cpu,
        cpl,
        ppu,
        ppl,
    };
};

export const getCPKPPKAlert = ({ cpk, ppk }) => {
    if (cpk < 0 || ppk < 0) {
        return {
            message: 'PARTS OUT OF SPEC – STOP PRODUCTION IMMEDIATELY',
            color: 'red',
            icon: 'close-sharp',
            title: 'Critical Alert',
        };
    }

    if ((cpk >= 0 && cpk < 1.0) || (ppk >= 0 && ppk < 1.0)) {
        return {
            message: 'PROCESS DRIFTING – ADJUST MACHINE NOW',
            color: 'orange',
            icon: 'warning',
            title: 'Warning Alert',
        };
    }

    if (cpk >= 1.0 && cpk < 1.33) {
        return {
            message: 'PROCESS NOT CAPABLE – MONITOR CLOSELY',
            color: 'orange',
            icon: 'warning',
            title: 'Warning Alert',
        };
    }

    if (cpk > ppk) {
        return {
            message: 'PROCESS NOT CONSISTENT OVER TIME – CHECK SETUP VARIATION',
            color: 'orange',
            icon: 'warning',
            title: 'Warning Alert',
        };
    }

    return {
        message: 'PROCESS IS STABLE AND CAPABLE',
        color: 'green',
        icon: '✅',
        title: 'Success Alert',
    };
};



export const validateSPC = ({
    type,
    masterData = [],
    previousSamples = [],
    lowValue,
    highValue,
}) => {
    if (type !== 'number') {
        return {
            hasChanges: false,
            alertMessage: '',
            alertColor: '',
        };
    }

    const currentSamples = masterData
        ?.filter(item => item?.value !== '')
        ?.map(item => parseFloat(item.value));

    const oldSamples = previousSamples
        ?.filter(item => item?.value !== '')
        ?.map(item => parseFloat(item.value));

    const hasChanges =
        currentSamples.length !== oldSamples.length ||
        currentSamples.some((value, index) => value !== oldSamples[index]);

    if (currentSamples.length < 2) {
        return {
            hasChanges,
            alertMessage: '',
            alertColor: '',
        };
    }

    const result = calculateCapability({
        sampleSize: currentSamples.length,
        sampleList: currentSamples,
        lowerSpecLimit: Number(lowValue),
        upperSpecLimit: Number(highValue),
    });

    const alert = getCPKPPKAlert({
        cpk: result.cpk,
        ppk: result.ppk,
    });

    if (hasChanges && alert?.color) {
        const backgroundColor =
            alert.color === 'red'
                ? COLORS.ERROR
                : alert.color === 'orange'
                ? COLORS.WARNING
                : COLORS.SUCCESS;

        const icon = alert.color === 'green' ? 'success' : 'warning';

        showMessage({
            message: alert.message,
            backgroundColor,
            color: COLORS.white,
            duration: 1500,
        });
    }

    return {
        hasChanges,
        alertMessage: alert?.message,
        alertColor: alert?.color,
        capability: result,
    };
};
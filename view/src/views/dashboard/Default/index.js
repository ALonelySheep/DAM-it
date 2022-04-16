import { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project imports
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import TotalIncomeLightCard from './TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import { gridSpacing } from 'store/constant';

// Auth
import { useAuth } from 'AuthProvider'
// API
import { getTotalValue, getMonthlyCost } from 'api/dashboardAPI';

const sumPriceByMonth = (prices) => {
    const sumArr = new Array(12).fill(0);
    for (let i = 0; i < sumArr.length; i += 1) {
        sumArr[i] += prices.paidContent[i] + prices.subscription[i] + prices.app[i];
    }
    // console.log(sumArr)
    return sumArr;
}


// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
    const [isLoading, setLoading] = useState(true);
    const [totalValue, setTotalValue] = useState(0);
    const [monthlyCost, setMonthlyCost] = useState({});
    const [monthlyCostSum, setMonthlyCostSum] = useState({});

    // Authentication
    const auth = useAuth();

    useEffect(() => {
        let isMounted = true;
        async function fetchData() {
            const tValue = await getTotalValue(auth.userInfo.token)
            setTotalValue(tValue);
            const mCost = await getMonthlyCost(auth.userInfo.token)
            setMonthlyCost(mCost);
            const mCostSum = sumPriceByMonth(mCost)
            setMonthlyCostSum(mCostSum);
            // console.log(mCostSum)
            // finish loading
            setLoading(false);
        }
        fetchData();
        return () => { isMounted = false };
    }, []);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item md={6} sm={6} xs={12}>
                        <EarningCard isLoading={isLoading} totalValue={totalValue} />
                    </Grid>
                    <Grid item md={6} sm={6} xs={12}>
                        <TotalOrderLineChartCard isLoading={isLoading} monthlyData={monthlyCostSum} />
                    </Grid>
                    {/* <Grid item lg={4} md={12} sm={12} xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item sm={6} xs={12} md={6} lg={12}>
                                <TotalIncomeDarkCard isLoading={isLoading} />
                            </Grid>
                            <Grid item sm={6} xs={12} md={6} lg={12}>
                                <TotalIncomeLightCard isLoading={isLoading} />
                            </Grid>
                        </Grid>
                    </Grid> */}
                </Grid>
            </Grid>
            <Grid item xs={12}>
                {/* <Grid container spacing={gridSpacing}> */}
                {/* <Grid item xs={12} md={8}> */}
                <TotalGrowthBarChart isLoading={isLoading} monthlyData={monthlyCost} />
                {/* </Grid> */}
                {/* <Grid item xs={12} md={4}>
                        <PopularCard isLoading={isLoading} />
                    </Grid> */}
                {/* </Grid> */}
            </Grid>
        </Grid>
    );
};

export default Dashboard;

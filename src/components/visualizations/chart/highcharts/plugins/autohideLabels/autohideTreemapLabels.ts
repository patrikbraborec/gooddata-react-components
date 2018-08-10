// (C) 2007-2018 GoodData Corporation
import {
    getVisibleSeries,
    getDataPoints,
    hideDataLabel,
    isLabelOverlappingItsShape,
    intersectsParentLabel,
    showDataLabel
} from '../../helpers';

function hideOverlappingChartLabels(visiblePoints: any) {
    visiblePoints.forEach((point: any) => {
        if (isLabelOverlappingItsShape(point) || intersectsParentLabel(point, visiblePoints)) {
            hideDataLabel(point);
        } else {
            showDataLabel(point);
        }
    });
}

const autohideTreemapLabels = (chart: any) => {
    const visibleSeries = getVisibleSeries(chart);
    const visiblePoints = getDataPoints(visibleSeries);
    hideOverlappingChartLabels(visiblePoints);
};

export default autohideTreemapLabels;
/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import Button from "@oxygen-ui/react/Button";
import Chip from "@oxygen-ui/react/Chip";
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import FeatureFlagLabel from "@wso2is/admin.feature-gate.v1/components/feature-flag-label";
import useFeatureFlag from "@wso2is/admin.feature-gate.v1/hooks/use-feature-flag";
import { FeatureFlagsInterface, TestableComponentInterface } from "@wso2is/core/models";
import { PageLayout } from "@wso2is/react-components";
import React, { CSSProperties, FunctionComponent, ReactElement, useMemo, useState } from "react";
import { useSelector } from "react-redux";

type FeatureFlagPlaygroundPagePropsInterface = TestableComponentInterface;

const FEATURE_FLAG_PLAYGROUND_LABEL_KEY: string = "featureFlagPlayground.buttonStatus";
const FEATURE_FLAG_PLAYGROUND_BEHAVIOR_KEY: string = "featureFlagPlayground.buttonBehavior";
const NATIVE_BUTTON_WRAPPER_STYLE: CSSProperties = {
    alignItems: "flex-start",
    display: "inline-flex",
    flexDirection: "column",
    gap: "8px"
};

const FeatureFlagPlaygroundPage: FunctionComponent<FeatureFlagPlaygroundPagePropsInterface> = ({
    "data-testid": testId = "feature-flag-playground-page"
}: FeatureFlagPlaygroundPagePropsInterface): ReactElement => {

    const [ clickCount, setClickCount ] = useState<number>(0);

    const featureConfig: FeatureConfigInterface = useSelector(
        (state: AppState) => state.config.ui.features
    );

    const playgroundFeatureFlags: FeatureFlagsInterface[] = useMemo(
        () => featureConfig?.featureFlagPlayground?.featureFlags ?? [],
        [ featureConfig?.featureFlagPlayground?.featureFlags ]
    );

    const statusFlag: string = useFeatureFlag(
        FEATURE_FLAG_PLAYGROUND_LABEL_KEY,
        playgroundFeatureFlags
    );

    const behaviorFlag: string = useFeatureFlag(
        FEATURE_FLAG_PLAYGROUND_BEHAVIOR_KEY,
        playgroundFeatureFlags
    );

    const isButtonEnabled: boolean = behaviorFlag === "TRUE";

    return (
        <PageLayout
            title="Feature Flag Playground"
            description="A temporary page to quickly verify feature flag lookup and rendering."
            backButton={ {
                onClick: (): void => history.push(AppConstants.getPaths().get("GETTING_STARTED")),
                text: "Back"
            } }
            data-testid={ testId }
        >
            <Stack spacing={ 3 }>
                <Typography variant="body1">
                    Raw status flag: { statusFlag || "not-set" }
                </Typography>
                <Typography variant="body1">
                    Raw behavior flag: { behaviorFlag || "not-set" }
                </Typography>
                <Stack direction="row" spacing={ 2 } alignItems="center">
                    <Typography variant="body1">
                        Standard label rendering:
                    </Typography>
                    <FeatureFlagLabel
                        featureFlags={ playgroundFeatureFlags }
                        featureKey={ FEATURE_FLAG_PLAYGROUND_LABEL_KEY }
                        type="chip"
                    />
                </Stack>
                <Stack direction="row" spacing={ 2 } alignItems="center">
                    <Typography variant="body1">
                        Direct chip from useFeatureFlag:
                    </Typography>
                    { statusFlag ? <Chip label={ statusFlag } size="small" /> : null }
                </Stack>
                <Button
                    onClick={ (): void => setClickCount((previousClickCount: number) => previousClickCount + 1) }
                    disabled={ !isButtonEnabled }
                >
                    Test Button
                </Button>
                <div style={ NATIVE_BUTTON_WRAPPER_STYLE }>
                    <Typography variant="body1">
                        Oxygen UI button with `FeatureFlagLabel` ribbon:
                    </Typography>
                    <Button
                        disabled={ !isButtonEnabled }
                    >
                        Export Users
                    </Button>
                    <FeatureFlagLabel
                        featureFlags={ playgroundFeatureFlags }
                        featureKey={ FEATURE_FLAG_PLAYGROUND_LABEL_KEY }
                        type="ribbon"
                    />
                </div>
                <Typography variant="body2">
                    Button enabled via feature flag: { isButtonEnabled ? "yes" : "no" }
                </Typography>
                <Typography variant="body2">
                    Click count: { clickCount }
                </Typography>
            </Stack>
        </PageLayout>
    );
};

export default FeatureFlagPlaygroundPage;

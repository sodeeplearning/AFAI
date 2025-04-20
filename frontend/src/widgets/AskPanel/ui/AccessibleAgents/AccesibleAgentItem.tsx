import { Skeleton, Tag } from "antd";
import { useStore } from "app/providers/StoreProvider";
import { useCallback, useEffect, useState } from "react";
import { GetAllModelsResponse } from "shared/api/services/GetAllModels/types";
import s from './AccessibleAgents.module.scss'
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { AppRoutes } from "shared/config/routeConfig/routeConfig";
import classNames from "shared/library/classNames/classNames";

interface AccessibleAgentsItemsProps {
    className?: string
}

export const AccessibleAgentsItems = observer((props: AccessibleAgentsItemsProps) => {
    const [checkedModel, setCheckedModel] = useState<string | null>(null)
    const {
        className
    } = props

    const { t } = useTranslation()

    const { getAllModelsStore } = useStore()

    useEffect(() => {
        const fetchData = async () => {
            await getAllModelsStore.getAllDownloadedModelsAction();
        };
        fetchData();
    }, [getAllModelsStore, getAllModelsStore.getAllDownloadedModelsAction]);

    const isLoading = getAllModelsStore.getAllDownloadedModelsData?.state === "pending"

    const handleCheckedModel = useCallback((model: string) => {
        setCheckedModel(model)
    }, [])


    return (
        <div className={classNames(s.accessibleAgentsItems, {}, [className])}>
            {isLoading && <Skeleton.Button />}
            {(getAllModelsStore.getAllDownloadedModelsData?.value as GetAllModelsResponse)?.data?.length ? 
                (getAllModelsStore.getAllDownloadedModelsData?.value as GetAllModelsResponse)?.data.map((model: string) => (
                    <Tag.CheckableTag
                        className={s.tag}
                        key={model}
                        checked={checkedModel === model}
                        onClick={() => handleCheckedModel(model)}
                    >
                        {model}
                    </Tag.CheckableTag>
                )) : 
                <Tag>
                    <Link to={AppRoutes.AGENTS}>
                        {t("Похоже, вы еще не скачали агента, приступим?")}
                    </Link>
                </Tag>
            }
        </div>
    )
})
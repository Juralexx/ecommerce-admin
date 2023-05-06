import React from 'react'
import styled from 'styled-components';
import { PageProps } from '@/types';
import { Search } from '@mui/icons-material';
import Breadcrumb from "@/components/global/Breadcrumb";
import { Input, Stack } from '@/components/global';

interface Props extends PageProps {
    toolsRight?: React.ReactNode;
    addButton?: React.ReactNode;
    filters?: React.ReactNode;
    onSearch?: () => void;
}

const RootPagesLayout = (props: Props) => {
    const { children, title, toolsRight, addButton, onSearch, filters } = props

    return (
        <React.Fragment>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1}
                alignItems={{ xs: 'flex-start', sm: "center" }}
                justifyContent={{ xs: 'flex-start', sm: "space-between" }}
            >
                <div>
                    <h2>{title}</h2>
                    <Breadcrumb />
                </div>
                {addButton}
            </Stack>
            <Stack
                direction={{ xs: filters ? 'column' : 'row', md: 'row' }}
                justifyContent={{ xs: filters ? 'flex-start' : 'center', md: "space-between" }}
                alignItems={{ xs: filters ? 'flex-start' : 'center', md: "center" }}
                spacing={1}
                style={{ padding: '10px 0', margin: '16px 0 8px' }}
            >
                {filters &&
                    <ToolRight>
                        {filters}
                    </ToolRight>
                }
                <ToolsLeft>
                    <Input
                        placeholder='Rechercher...'
                        icon={<Search />}
                        onChange={onSearch}
                        style={{ width: '100%', marginRight: 8 }}
                    />
                    {toolsRight}
                </ToolsLeft>
            </Stack>
            {children}
        </React.Fragment>
    )
}

export default RootPagesLayout

const ToolRight = styled.div`
    display     : flex;
    align-items : center;

    > *:not(:last-child) {
        margin-right : 10px;
    }

    @media (max-width: 768px) {
        width : 100%;

        .select-container {
            width : 100%;
        }
    }
`

const ToolsLeft = styled.div`
    display     : flex;
    align-items : center;
    width       : 100%;
    max-width   : 400px;

    @media(max-width: 768px) {
        max-width : 100%;
    }
`
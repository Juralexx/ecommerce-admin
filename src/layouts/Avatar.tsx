import React from 'react'
import styled from 'styled-components';
import { NextRouter } from 'next/router';
import { logout } from '@/api/auth';
import Logout from '@mui/icons-material/Logout';
import { Avatar, Divider, ToolMenu } from '@/components/global';
import Link from 'next/link';

interface Props {
    user: any;
    router: NextRouter;
}

const UserAvatar = ({ user, router }: Props) => {

    return (
        <UserAvatarContainer>
            <ToolMenu placement='bottom-start' target={
                <AvatarInner>
                    <div className='name'>
                        {user.name}
                    </div>
                    <Avatar>
                        {user.name.charAt(0)}
                    </Avatar>
                </AvatarInner>
            }>
                <Link href={`/users/${user._id}`}>
                    <Avatar style={{ width: '24px', height: '24px', fontSize: '16px', marginRight: '10px' }}>
                        {user.name.charAt(0)}
                    </Avatar>
                    Profile
                </Link>
                <Divider />
                <div onClick={() => logout()}>
                    <Logout fontSize="small" /> Logout
                </div>
            </ToolMenu>
        </UserAvatarContainer>
    )
}

export default UserAvatar

const UserAvatarContainer = styled.div`
    display       : flex;
    align-items   : center;
    padding       : 5px 10px 5px 15px;
    margin-left   : 5px;
    border-radius : var(--rounded-sm);
    border        : 1px solid transparent;

    .name {
        line-height  : 18px;
        margin-top   : 2px;
        margin-right : 10px;
        color        : var(--text);
    }

    &:hover,
    &.active {
        background-color : var(--bg-one);
        border           : 1px solid var(--light-border);
    }
`

const AvatarInner = styled.div`
    display       : flex;
    align-items   : center;
`
'use client';
import {
  MdFormatListBulleted,
  MdOutlineCreateNewFolder,
  MdOutlineDriveFileMove,
  MdOutlineIncompleteCircle,
  MdOutlineResetTv,
} from 'react-icons/md';
import React from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Divider,
} from '@nextui-org/react';
import { AcmeLogo } from '../../../public/AcmeLogo';
import { ChevronDownIcon } from '../../../public/icons/ChevronDownIcon';
import { IoCloudUploadOutline, IoCreateOutline } from 'react-icons/io5';
import logo from '../../../public/logo.svg';
import Image from 'next/image';

const dropDownItemStyle = 'flex gap-4 items-center';

const createItems = [
  {
    title: 'Create Manga',
    link: '/create',
    icon: <IoCreateOutline size={20} />,
  },
  {
    title: 'Incomplete Upload',
    link: '/create/incomplete-upload',
    icon: <MdOutlineIncompleteCircle size={20} />,
  },
  {
    title: 'Manually Upload Chapter',
    link: '/create/manual-upload-chapter',
    icon: <IoCloudUploadOutline size={20} />,
  },
  {
    title: 'Move To Hasura',
    link: '/create/move-to-hasura',
    icon: <MdOutlineDriveFileMove size={20} />,
  },
  {
    title: 'Manually Create Chapter in Sanity',
    link: '/create/manual-create-sanity',
    icon: <IoCloudUploadOutline size={20} />,
  },
];

export default function App() {
  // const icons = {
  //   chevron: <ChevronDown fill="currentColor" size={16} />,
  //   scale: <Scale className="text-warning" fill="currentColor" size={30} />,
  //   lock: <Lock className="text-success" fill="currentColor" size={30} />,
  //   activity: (
  //     <Activity className="text-secondary" fill="currentColor" size={30} />
  //   ),
  //   flash: <Flash className="text-primary" fill="currentColor" size={30} />,
  //   server: <Server className="text-success" fill="currentColor" size={30} />,
  //   user: <TagUser className="text-danger" fill="currentColor" size={30} />,
  // };

  return (
    <Navbar>
      <NavbarBrand>
        <Link href="/">
          <Image priority height={45} width={230} src={logo.src} alt="" />
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {/* Create DropDown */}
        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button
                disableRipple
                className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                endContent={<ChevronDownIcon />}
                radius="sm"
                variant="light"
              >
                Create
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu
            aria-label="ACME features"
            className="w-[340px]"
            itemClasses={{
              base: 'gap-4',
            }}
          >
            {createItems.map((item, idx) => (
              <DropdownItem key={idx}>
                <div className={dropDownItemStyle}>
                  {item.icon}
                  <Link color="foreground" href={item.link} target="_blank">
                    {item.title}
                  </Link>
                </div>
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        <NavbarItem isActive>
          <Link href="/sanity/mangas" target="_blank" aria-current="page">
            Sanity List
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/mangas" target="_blank">
            Hasura Mangas
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            color="foreground"
            href="/create/move-to-hasura"
            target="_blank"
          >
            Move To Hasura
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="#">Login</Link>
        </NavbarItem>

        <NavbarItem>
          <Button
            as={Link}
            className="hidden lg:flex"
            color="danger"
            href="#"
            variant="flat"
            onClick={async () => client.resetStore()}
            endContent={<MdOutlineResetTv size={22} />}
          >
            Reset Store
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

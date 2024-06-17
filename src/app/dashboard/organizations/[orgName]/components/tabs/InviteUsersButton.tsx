import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/solid';
import { ReactMultiEmail } from 'react-multi-email';
import 'react-multi-email/dist/style.css';
import { ApiResponse } from '@/app/util/response';
import { OrganizationInvitationsRequestDto } from '@/app/api.types';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';

async function inviteUsers(orgName: string, emails: string[]) {
  const requestBody: OrganizationInvitationsRequestDto = {
    emails,
  };

  const res = await fetch(`/api/organizations/${orgName}/invitations`, {
    method: 'POST',
    body: JSON.stringify(requestBody),
  });

  return await res.json();
}

export default function InviteUsersButton() {
  const params = useParams<{ orgName: string }>();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [emails, setEmails] = useState<string[]>([]);
  const [focused, setFocused] = useState(false);

  async function submitForm(onClose: Function) {
    const { success, data, message } = await inviteUsers(
      params.orgName,
      emails,
    );
    if (success) {
      toast.success('Invitations were sent successfully');
      onClose();
    } else {
      toast.error(`Error creating invitations:  ${message}`);
    }
  }

  return (
    <div className="flex">
      <Button
        color="primary"
        startContent={<PlusIcon className="size-6" />}
        className="ml-auto"
        onPress={onOpen}
      >
        Invite
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Invite users
              </ModalHeader>
              <ModalBody className="p-4">
                <ReactMultiEmail
                  placeholder="Insert user emails"
                  emails={emails}
                  onChange={(_emails: string[]) => {
                    setEmails(_emails);
                  }}
                  autoFocus={true}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  getLabel={(email, index, removeEmail) => {
                    return (
                      <div data-tag key={index}>
                        <div data-tag-item>{email}</div>
                        <span
                          data-tag-handle
                          onClick={() => removeEmail(index)}
                        >
                          ×
                        </span>
                      </div>
                    );
                  }}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={() => submitForm(onClose)}>
                  Invite users
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

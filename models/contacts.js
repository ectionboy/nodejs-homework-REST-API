const fs = require('fs/promises')
const path = require("node:path");
const { nanoid } = require('nanoid')

const contactsPath = path.join(process.cwd(), 'models/contacts.json');

async function readFile() {
    const contacts = await fs.readFile(contactsPath);
    const result = JSON.parse(contacts);
    return result;
}
async function writeFile(contacts) {
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
}

const listContacts = async () => {
  const data = await readFile();
  return data;
}

const getContactById = async (contactId) => {
  const data = await readFile();
  const contact = data.find((contact) => contact.id === contactId);
return contact || null;
}

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  }
  const [contact] = contacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contact;
}

const addContact = async (body) => {
  const contacts = await listContacts();
    const newContact = {
      id: nanoid(),
      ...body,
    };
    contacts.push(newContact);
    writeFile(contacts);
    return newContact;
}

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  }
  const oldContact = contacts[index];
  const updatedContact = {
    ...oldContact,
    ...body
  }
  contacts[index] = updatedContact;
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[index];
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}

type Person = {
  firstName: string;
  lastName: string;
  id: number;
};

function printPerson(person: Person) {
  console.log(person);
}

const person: Person = {
  firstName: "Arun",
  lastName: "Kenjila",
  id: 12,
};

printPerson(person)
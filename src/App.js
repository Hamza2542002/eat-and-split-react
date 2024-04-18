import React, { useState } from "react";
import "./index.css";
const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [show, setShow] = useState(false);
  const [choosenFriend, setChoosenFriend] = useState(null);

  function onAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShow(false);
  }

  function handleshow() {
    setShow((s) => !s);
  }

  function handleSelection(friend, isSelected) {
    isSelected
      ? setChoosenFriend((f) => null)
      : setChoosenFriend((f) => friend);
    setShow(false);
  }

  function updateBalance(balance) {
    setFriends(
      friends.map((f) =>
        f.id === choosenFriend.id ? { ...f, balance: balance + f.balance } : f
      )
    );
    setChoosenFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          onSelection={handleSelection}
          choosenFriend={choosenFriend}
        />
        {show && (
          <FormAddFriend
            handleAddFriend={onAddFriend}
            handleshow={handleshow}
          />
        )}
        <button className="button" onClick={handleshow}>
          {show ? "Close" : "Add Friend"}
        </button>
      </div>
      {choosenFriend && (
        <FormSplitBill friend={choosenFriend} updateBalance={updateBalance} />
      )}
    </div>
  );
}

function Friend({ friend, onSelection, choosenFriend, handleSplit }) {
  const isSelected = choosenFriend === friend;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt="" />
      <div className="text">
        <h3>{friend.name}</h3>
        <p
          className={
            friend.balance < 0 ? "red" : friend.balance > 0 ? "green" : ""
          }
        >
          {friend.balance < 0
            ? `You owe ${friend.name} ${-1 * friend.balance} $`
            : friend.balance > 0
            ? `${friend.name} owes you ${friend.balance} $`
            : `You and ${friend.name} are even`}
        </p>
      </div>
      <button
        className="button"
        onClick={() => onSelection(friend, isSelected)}
      >
        {isSelected ? "Close" : "Select"}
      </button>
    </li>
  );
}

function FormAddFriend({ handleAddFriend, handleshow }) {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("https://i.pravatar.cc/48");
  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !imageUrl) return;
    const id = crypto.randomUUID();
    const friend = {
      name: name,
      image: `${imageUrl}?=${id}`,
      balance: 0,
      id,
    };
    handleAddFriend(friend);
    setName("");
    setImageUrl("https://i.pravatar.cc/48");
    handleshow();
  }
  return (
    <form className="form-add-friend">
      <label>Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>Image URL</label>
      <input
        type="text"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />

      <button className="button" type="submit" onClick={(e) => handleSubmit(e)}>
        Add
      </button>
    </form>
  );
}

function FormSplitBill({ friend, updateBalance }) {
  const name = friend.name;
  const [bill, setBill] = useState("");
  const [expence, setExpence] = useState("");
  const [payingone, setPayingOne] = useState("user");
  const paidByFriend =
    bill && Number(expence) < Number(bill) ? bill - expence : "";
  function handleSubmit(e) {
    e.preventDefault();
    if (!bill) return;
    if (payingone === "user") {
      console.log(bill, expence);
      updateBalance(paidByFriend);
    } else {
      updateBalance(-1 * paidByFriend);
    }
  }
  return (
    <form className="form-split-bill" onSubmit={(e) => handleSubmit(e)}>
      <h2>SPLIT BILL WITH {name}</h2>
      <label>Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(e.target.value)}
      />

      <label>Your expence</label>
      <input
        type="text"
        value={expence}
        onChange={(e) =>
          setExpence(
            Number(e.target.value) < Number(bill)
              ? Number(e.target.value)
              : expence
          )
        }
      />

      <label> {name}'s expence</label>
      <input type="text" disabled value={paidByFriend} />

      <label>Who is paying the bill</label>
      <select onChange={(e) => setPayingOne(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{name}</option>
      </select>

      <button className="button" type="submit">
        Split bill
      </button>
    </form>
  );
}

function FriendList({ friends, onSelection, choosenFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          choosenFriend={choosenFriend}
        />
      ))}
    </ul>
  );
}

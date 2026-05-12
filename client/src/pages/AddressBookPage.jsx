import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageTransition from "../components/common/PageTransition";
import AddressCard from "../components/AddressCard";
import AddressForm from "../components/AddressForm";
import {
  addAddress,
  deleteAddress,
  fetchAddresses,
  setDefaultAddress,
  updateAddress
} from "../features/address/addressSlice";
import { notifyError, notifySuccess } from "../components/common/Toast";

export default function AddressBookPage() {
  const dispatch = useDispatch();
  const { addresses, status, error } = useSelector((state) => state.address);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      if (editing) {
        await dispatch(updateAddress({ id: editing._id, data })).unwrap();
        notifySuccess("Address updated");
      } else {
        await dispatch(addAddress(data)).unwrap();
        notifySuccess("Address added");
      }
      setShowForm(false);
      setEditing(null);
    } catch (err) {
      notifyError(err || "Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Address Book</h1>
          {addresses.length < 5 ? (
            <button onClick={() => { setEditing(null); setShowForm(true); }} className="rounded bg-zivvo-amber-brand px-3 py-2 text-sm font-semibold text-black">
              Add new address
            </button>
          ) : <p className="text-xs text-zivvo-text-muted">Maximum 5 addresses reached</p>}
        </div>

        {status === "loading" && <p className="text-zivvo-text-muted">Loading addresses...</p>}
        {status === "failed" && <p className="text-red-300">{error}</p>}

        {showForm && (
          <div className="mb-5 rounded-xl border border-zivvo-dark-raised bg-zivvo-dark-surface p-4">
            <AddressForm initialData={editing} onSubmit={onSubmit} onCancel={() => { setShowForm(false); setEditing(null); }} loading={saving} />
          </div>
        )}

        {addresses.length === 0 && status !== "loading" ? (
          <div className="rounded-xl border border-zivvo-dark-raised bg-zivvo-dark-surface p-8 text-center">
            <p className="text-zivvo-text-muted">Add your first address to speed up checkout.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
            {addresses.map((address) => (
              <AddressCard
                key={address._id}
                address={address}
                onEdit={(row) => { setEditing(row); setShowForm(true); }}
                onDelete={async (row) => {
                  await dispatch(deleteAddress(row._id));
                  notifySuccess("Address deleted");
                }}
                onSetDefault={async (row) => {
                  await dispatch(setDefaultAddress(row._id));
                  notifySuccess("Default address updated");
                }}
              />
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}


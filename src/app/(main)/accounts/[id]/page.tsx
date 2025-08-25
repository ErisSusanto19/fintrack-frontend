'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadAccountById } from '@/store/features/accounts/accounts.thunk';
import { clearSelectedAccount } from '@/store/features/accounts/accounts.slice';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const AccountDetailPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { selectedItem: account, loading, error } = useAppSelector((state) => state.accounts);

  const params = useParams(); 
  const accountId = params.id;

  useEffect(() => {
    if (accountId) {
      dispatch(loadAccountById(accountId as string));
    }

    return () => {
      dispatch(clearSelectedAccount());
    };
  }, [accountId, dispatch]);

  if (loading === 'pending') {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }
  
  if (error) {
      return <div className="text-red-500">Error: {error}</div>
  }

  if (!account) {
    return <div>Account not found.</div>;
  }

  return (
    <div>
      <Link href="/accounts" className="flex items-center mb-4 text-sm text-gray-600 hover:underline">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Accounts
      </Link>
      <h1 className="text-3xl font-bold">{account.name}</h1>
      <p className="text-gray-500">{account.type}</p>
      <div className="mt-8 text-4xl font-light">
        {formatCurrency(account.balance)}
      </div>
      
    </div>
  );
};

export default AccountDetailPage;
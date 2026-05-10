import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Banknote, Package, Activity, Plus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from 'react';

export default function AdminPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [newPhone, setNewPhone] = useState({
    brand: '',
    model: '',
    price_pkr: 0,
    stock_count: 0,
    display: '',
    battery: '',
    camera: '',
    chipset: '',
    image_url: ''
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await fetch('/api/admin/stats');
      return res.json();
    }
  });

  const { data: inventory, isLoading: invLoading } = useQuery({
    queryKey: ['admin-inventory'],
    queryFn: async () => {
      const res = await fetch('/api/admin/inventory');
      return res.json();
    }
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await fetch('/api/admin/users');
      return res.json();
    }
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const res = await fetch('/api/admin/orders');
      return res.json();
    }
  });

  const addPhoneMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        brand: newPhone.brand,
        model: newPhone.model,
        price_pkr: newPhone.price_pkr,
        stock_count: newPhone.stock_count,
        image_url: newPhone.image_url,
        specs: {
          display: newPhone.display,
          battery: newPhone.battery,
          camera: newPhone.camera,
          chipset: newPhone.chipset
        }
      };
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to add phone');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-inventory'] });
      setOpen(false);
      setNewPhone({ brand: '', model: '', price_pkr: 0, stock_count: 0, display: '', battery: '', camera: '', chipset: '', image_url: '' });
    }
  });

  return (
    <div className="max-w-[1024px] mx-auto px-6 py-8 flex-1 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Dashboard</h1>
        <p className="text-slate-500 mt-2">Manage products, users, and view platform analytics.</p>
      </div>

      {statsLoading ? (
        <div className="animate-pulse bg-slate-200 h-32 rounded-3xl mb-12"></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-none shadow-sm rounded-3xl bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">Total Revenue</CardTitle>
              <Banknote className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-slate-900">Rs. {stats?.totalSales.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm rounded-3xl bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">System Liability</CardTitle>
              <Activity className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-slate-900">Rs. {stats?.systemLiability.toLocaleString()}</div>
              <p className="text-xs text-slate-500 mt-1">Total user wallet balances</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-3xl bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-slate-900">{stats?.totalUsers.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Inventory Management Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                <Package className="w-5 h-5 text-slate-700" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Inventory Status</h2>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger render={
                <Button size="sm" className="rounded-full bg-slate-900 hover:bg-slate-800 text-white">
                  <Plus className="w-4 h-4 mr-2" /> Add Phone
                </Button>
              } />
              <DialogContent className="sm:max-w-[425px] rounded-[32px] p-8 border-none shadow-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black text-slate-900">Add New Phone</DialogTitle>
                  <DialogDescription>
                    Add a new mobile to the store inventory.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="brand">Brand</Label>
                      <Input id="brand" value={newPhone.brand} onChange={e => setNewPhone({...newPhone, brand: e.target.value})} placeholder="e.g. Apple" className="rounded-xl bg-slate-50 border-slate-100" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model">Model</Label>
                      <Input id="model" value={newPhone.model} onChange={e => setNewPhone({...newPhone, model: e.target.value})} placeholder="e.g. iPhone 15" className="rounded-xl bg-slate-50 border-slate-100" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (PKR)</Label>
                      <Input id="price" type="number" value={newPhone.price_pkr || ''} onChange={e => setNewPhone({...newPhone, price_pkr: Number(e.target.value)})} placeholder="0" className="rounded-xl bg-slate-50 border-slate-100" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock</Label>
                      <Input id="stock" type="number" value={newPhone.stock_count || ''} onChange={e => setNewPhone({...newPhone, stock_count: Number(e.target.value)})} placeholder="0" className="rounded-xl bg-slate-50 border-slate-100" />
                    </div>
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Specs</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="display">Display</Label>
                      <Input id="display" value={newPhone.display} onChange={e => setNewPhone({...newPhone, display: e.target.value})} placeholder="AMOLED, 120Hz" className="rounded-xl bg-slate-50 border-slate-100 text-xs" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="battery">Battery</Label>
                      <Input id="battery" value={newPhone.battery} onChange={e => setNewPhone({...newPhone, battery: e.target.value})} placeholder="5000 mAh" className="rounded-xl bg-slate-50 border-slate-100 text-xs" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="camera">Camera</Label>
                      <Input id="camera" value={newPhone.camera} onChange={e => setNewPhone({...newPhone, camera: e.target.value})} placeholder="108MP" className="rounded-xl bg-slate-50 border-slate-100 text-xs" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="chipset">Chipset</Label>
                      <Input id="chipset" value={newPhone.chipset} onChange={e => setNewPhone({...newPhone, chipset: e.target.value})} placeholder="Snapdragon 8 Gen 2" className="rounded-xl bg-slate-50 border-slate-100 text-xs" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button onClick={() => addPhoneMutation.mutate()} disabled={addPhoneMutation.isPending} className="rounded-full bg-blue-600 hover:bg-blue-700 text-white w-full h-12">
                     {addPhoneMutation.isPending ? 'Adding...' : 'Add Phone'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-100">
                  <TableHead className="font-semibold text-slate-500 uppercase text-[10px] tracking-wider">Model</TableHead>
                  <TableHead className="font-semibold text-slate-500 uppercase text-[10px] tracking-wider">Price</TableHead>
                  <TableHead className="font-semibold text-slate-500 uppercase text-[10px] tracking-wider text-right">Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invLoading ? (
                  <TableRow><TableCell colSpan={3} className="text-center py-8">Loading...</TableCell></TableRow>
                ) : inventory?.map((item: any) => (
                  <TableRow key={item.id} className="border-slate-100 border-b last:border-0 hover:bg-slate-50">
                    <TableCell>
                      <p className="font-semibold text-slate-900">{item.model}</p>
                      <p className="text-xs text-slate-400">{item.brand}</p>
                    </TableCell>
                    <TableCell className="text-slate-600">Rs. {item.price_pkr.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={item.stock_count > 10 ? 'secondary' : 'destructive'} className="font-mono">
                        {item.stock_count}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* User Management Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-slate-700" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">User Wallets</h2>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-100">
                  <TableHead className="font-semibold text-slate-500 uppercase text-[10px] tracking-wider">User</TableHead>
                  <TableHead className="font-semibold text-slate-500 uppercase text-[10px] tracking-wider text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersLoading ? (
                  <TableRow><TableCell colSpan={2} className="text-center py-8">Loading...</TableCell></TableRow>
                ) : users?.map((u: any) => (
                  <TableRow key={u.id} className="border-slate-100 border-b last:border-0 hover:bg-slate-50">
                    <TableCell>
                      <p className="font-semibold text-slate-900">{u.full_name}</p>
                      <p className="text-xs text-slate-400">{u.email}</p>
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium text-slate-700">
                      Rs. {u.wallet_balance.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Orders Management Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 mt-12 mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
            <Package className="w-5 h-5 text-slate-700" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Purchase Requests</h2>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100">
                <TableHead className="font-semibold text-slate-500 uppercase text-[10px] tracking-wider">Order ID</TableHead>
                <TableHead className="font-semibold text-slate-500 uppercase text-[10px] tracking-wider">Product</TableHead>
                <TableHead className="font-semibold text-slate-500 uppercase text-[10px] tracking-wider">Buyer Name</TableHead>
                <TableHead className="font-semibold text-slate-500 uppercase text-[10px] tracking-wider">Contact</TableHead>
                <TableHead className="font-semibold text-slate-500 uppercase text-[10px] tracking-wider">Address</TableHead>
                <TableHead className="font-semibold text-slate-500 uppercase text-[10px] tracking-wider text-right">Amount (PKR)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ordersLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : orders?.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-slate-400">No purchase requests yet</TableCell></TableRow>
              ) : orders?.map((o: any) => (
                <TableRow key={o.id} className="border-slate-100 border-b last:border-0 hover:bg-slate-50">
                  <TableCell className="font-mono text-xs text-slate-500">#{o.id}</TableCell>
                  <TableCell>
                    <p className="font-bold text-slate-900">{o.brand} {o.model}</p>
                    <p className="text-[10px] text-slate-400">{new Date(o.created_at).toLocaleString()}</p>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-slate-700">{o.buyer_name}</TableCell>
                  <TableCell>
                    <p className="text-xs text-slate-700">{o.buyer_phone}</p>
                    <p className="text-[10px] text-slate-400">{o.buyer_email}</p>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500 max-w-[200px] truncate" title={o.buyer_address}>{o.buyer_address}</TableCell>
                  <TableCell className="text-right font-mono font-medium text-slate-900">
                    Rs. {o.price_pkr.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

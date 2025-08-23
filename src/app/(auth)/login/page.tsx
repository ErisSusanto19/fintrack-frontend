'use client';

import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { 
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
 } from '../../../components/ui/card'
import { Eye, EyeOff, Loader2, LogIn } from 'lucide-react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { useRouter } from 'next/router';
import { loginUser } from '@/store/features/authSlice';

const formSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Please enter a valid email address." }),
    password: z
        .string()
        .min(1, { message: "Password is required." })
        .min(8, { message: "Password must be at least 8 characters." })
})

const LoginPage = () => {

    const [showPassword, setShowPassword] = useState(false)
    const dispatch = useAppDispatch();
    // const router = useRouter();
    const { loading, error } = useAppSelector(state => state.auth)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: ''
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const resultAction = await dispatch(loginUser(values));

        if(loginUser.fulfilled.match(resultAction)){
            alert("Login successfully")
            // router.push('/')
        }
    }

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-100'>
            <Card className='w-full max-w-sm'>
                <CardHeader>
                    <CardTitle className='text-2xl'>Login</CardTitle>
                    <CardDescription>
                        Log in with your email and password.
                    </CardDescription>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardContent className='grid gap-4'>
                            <FormField
                                control={form.control}
                                name='email'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder='name@email.com' {...field}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='password'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <div className='relative'>
                                            <FormControl>
                                                <Input type={showPassword? 'text' : 'password'} {...field}/>
                                            </FormControl>
                                            <div
                                                className='absolute inset-y-3 right-0 items-center pr-3 cursor-pointer'
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword? (
                                                    <Eye className='w-4 h-4 text-gray-500'/>
                                                ) : (
                                                    <EyeOff className='w-4 h-4 text-gray-500'/>
                                                )}
                                            </div>
                                        </div>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardFooter className='mt-4'>
                            <Button className='w-full'>
                                {loading? (
                                    <Loader2 className='w-4 h-4 mr-2 animate-spin'/>
                                ):(
                                    <LogIn className='w-4 h-4 mr-2'/>
                                )}
                                {loading? "Logging in..." : "Login"}
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>
    )
}

export default LoginPage;
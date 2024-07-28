import { useRef, useState, useEffect } from "react";
import { UrlState } from "@/context";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "./ui/card";
import * as yup from 'yup';
import { QRCode } from "react-qrcode-logo";
import { PlusIcon } from "lucide-react";
import { getUrls } from '../../db/apiUrls';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from 'framer-motion';
import '../App.css';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import useFetch from "@/hooks/useFetch";
import { createUrl } from "../../db/apiUrls";
import { BeatLoader } from "react-spinners";

function Error({ message }) {
    return <div className="text-red-500">{message}</div>;
}

export default function CreateLink() {
    const { user } = UrlState();
    const navigate = useNavigate();
    const ref = useRef();

    let [searchParams, setSearchParams] = useSearchParams();
    const longLink = searchParams.get("createNew");

    

    const [errors, setErrors] = useState({});
    const [formValues, setFormValues] = useState({
        title: "",
        longUrl: longLink ? longLink : "",
        customUrl: "",
        category: "",
    });

    const schema = yup.object().shape({
        title: yup.string().required("Title is required"),
        longUrl: yup
            .string()
            .url("Must be a valid URL")
            .required("Long URL is required"),
        customUrl: yup.string(),
        category: yup.string(),
    });

    const handleChange = (e) => {
        setFormValues({
            ...formValues,
            [e.target.id]: e.target.value,
        });
    };

    const { loading, error, data, fn: fnCreateUrl } = useFetch(createUrl, { ...formValues, user_id: user.id });

    useEffect(() => {
        if (error === null && data) {
            navigate(`/link/${data[0].id}`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error, data]);

    // useEffect(()=>{
    //     fnUrls();
    //     if(urls?.length){
    //         setPresentCategory(urls?.map((url,index)=>{
    //             return url.category;
    //         }))
    //       }
    // },[urls?.length])

    const createNewLink = async () => {
        setErrors([]);
        try {
            await schema.validate(formValues, { abortEarly: false });

            const canvas = ref.current.canvasRef.current;
            const blob = await new Promise((resolve) => canvas.toBlob(resolve));

            await fnCreateUrl(blob);
        } catch (e) {
            const newErrors = {};

            e?.inner?.forEach((err) => {
                newErrors[err.path] = err.message;
            });

            setErrors(newErrors);
        }
    };

    const [categoryList, setCategoryList] = useState(['Category', 'Study', 'Jobs', 'University', 'IG Hacks']);
    const [category, setCategory] = useState(categoryList[0]);
    const [isAdding, setIsAdding] = useState(false);
    const [newCategory, setNewCategory] = useState('');

    const onSelectCategoryClick = (selectedCategory) => {
        setCategory(selectedCategory);
        setFormValues({ ...formValues, category: selectedCategory });
    };

    const onAddCategoryList = () => {
        setCategoryList([...categoryList, newCategory]);
        setCategory(newCategory);
        setFormValues({ ...formValues, category: newCategory });
        setNewCategory('');
        setIsAdding(false);
    };

    const handleEnterPress = (e) => {
        if (e.key === 'Enter') {
            onAddCategoryList();
        }
    };

    return (
        <Dialog
            defaultOpen={longLink}
            onOpenChange={(res) => {
                if (!res) setSearchParams({});
            }}
        >
            <DialogTrigger asChild>
                <Button variant="destructive">Create New Link</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-bold text-2xl">Create New</DialogTitle>
                </DialogHeader>
                {formValues?.longUrl && (
                    <QRCode ref={ref} size={250} value={formValues?.longUrl} />
                )}

                <Input
                    id="title"
                    placeholder="Short Link's Title"
                    value={formValues.title}
                    onChange={handleChange}
                />
                {errors.title && <Error message={errors.title} />}
                <Input
                    id="longUrl"
                    placeholder="Enter your Loooong URL"
                    value={formValues.longUrl}
                    onChange={handleChange}
                />
                {errors.longUrl && <Error message={errors.longUrl} />}
                <div className="flex items-center gap-2">
                    <Card className="p-2">bytebite.in</Card> /
                    <Input
                        id="customUrl"
                        placeholder="Custom Link (optional)"
                        value={formValues.customUrl}
                        onChange={handleChange}
                    />
                </div>
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">{category}</Button>
                </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {categoryList.map((category, index) => (
                            <DropdownMenuItem id="category" key={index} onClick={() => onSelectCategoryClick(category)}>
                                {category}
                            </DropdownMenuItem>
                        ))}
                        <div className="flex justify-center box">
                            {!isAdding ? (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsAdding(true)}
                                    className='transition-opacity duration-300 ease-in-out'
                                >
                                    <PlusIcon className="h-4" />
                                </Button>
                            ) : (
                                <Input
                                    id="newCategory"
                                    value={newCategory}
                                    placeholder="Enter new category"
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    onKeyDown={handleEnterPress}
                                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the input
                                />
                            )}
                        </div>

                    </DropdownMenuContent>
                </DropdownMenu>
                {error && <Error message={error.message} />}
                <DialogFooter className="sm:justify-start">
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={createNewLink}
                        disabled={loading}
                    >
                        {loading ? <BeatLoader size={10} color="white" /> : "Create"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

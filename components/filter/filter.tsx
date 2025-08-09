"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface FilterFormData {
  genre: string;
  year: string;
  rating: number[];
  language: string;
}

const genreOptions = [
  { id: "28", name: "Action" },
  { id: "12", name: "Adventure" },
  { id: "16", name: "Animation" },
  { id: "35", name: "Comedy" },
  { id: "80", name: "Crime" },
  { id: "99", name: "Documentary" },
  { id: "18", name: "Drama" },
  { id: "10751", name: "Family" },
  { id: "14", name: "Fantasy" },
  { id: "36", name: "History" },
  { id: "27", name: "Horror" },
  { id: "10402", name: "Music" },
  { id: "9648", name: "Mystery" },
  { id: "10749", name: "Romance" },
  { id: "878", name: "Science Fiction" },
  { id: "10770", name: "TV Movie" },
  { id: "53", name: "Thriller" },
  { id: "10752", name: "War" },
  { id: "37", name: "Western" },
];

const languageOptions = [
  { id: "en", name: "English" },
  { id: "es", name: "Spanish" },
  { id: "hi", name: "Hindi" },
  { id: "ja", name: "Japanese" },
  { id: "bn", name: "Bengali" },
];

export default function AdvancedFilterDialog() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FilterFormData>({
    defaultValues: {
      genre: genreOptions[0].id,
      year: "2025",
      rating: [7],
      language: languageOptions[0].id,
    },
  });

  const [sliderValue, setSliderValue] = useState<number[]>([7]);

  const onSubmit = (data: FilterFormData) => {
    const query = new URLSearchParams();

    if (!data.genre || !data.year || !data.rating?.[0] || !data.language) return;

    query.append("with_genres", data.genre);
    query.append("primary_release_year", data.year);
    query.append("vote_average.gte", data.rating[0].toString());
    query.append("with_original_language", data.language);
    query.append("sort_by", "popularity.desc");
    query.append("include_adult", "false");

    router.push(`/discover?${query.toString()}`);
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button size="lg">Advanced Filter</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Advanced Filtering</DialogTitle>
            <DialogDescription>
              All fields are required. Discover movies based on your exact taste.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Genre */}
            <div>
              <Label>Genre</Label>
              <Select
                defaultValue={genreOptions[0].id}
                onValueChange={(value) => setValue("genre", value, { shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  {genreOptions.map((genre) => (
                    <SelectItem key={genre.id} value={genre.id}>
                      {genre.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.genre && (
                <p className="text-sm text-red-500">Genre is required</p>
              )}
            </div>

            {/* Year */}
            <div>
              <Label>Release Year</Label>
              <Input
                type="number"
                {...register("year", {
                  required: "Year is required",
                  pattern: {
                    value: /^\d{4}$/,
                    message: "Enter a valid 4-digit year",
                  },
                })}
              />
              {errors.year && (
                <p className="text-sm text-red-500">{errors.year.message}</p>
              )}
            </div>

            {/* Rating */}
            <div>
              <Label>Minimum Rating</Label>
              <Slider
                min={0}
                max={10}
                step={0.5}
                value={sliderValue}
                onValueChange={(value) => {
                  setSliderValue(value);
                  setValue("rating", value, { shouldValidate: true });
                }}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Selected: {sliderValue[0]}
              </p>
              {errors.rating && (
                <p className="text-sm text-red-500">Rating is required</p>
              )}
            </div>

            {/* Language */}
            <div>
              <Label>Language</Label>
              <Select
                defaultValue={languageOptions[0].id}
                onValueChange={(value) => setValue("language", value, { shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((lang) => (
                    <SelectItem key={lang.id} value={lang.id}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.language && (
                <p className="text-sm text-red-500">Language is required</p>
              )}
            </div>

            {/* Footer */}
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Apply Filters</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

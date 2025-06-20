using Domain;

namespace Persistence
{
    public class Seed
    {
        public static async Task SeedDataAsync(DataContext context)
        {
            if (context.Words.Any()) return; // Check if any words already exist
            var categories = new List<Category>
            {
                new Category { Name = "General" },
                new Category { Name = "Education" },
                new Category { Name = "Science" },
                new Category { Name = "Technology" },
                new Category { Name = "Emotions" },
                new Category { Name = "Personality" },
                new Category { Name = "Speed" },
                new Category { Name = "Temperature" },
                new Category { Name = "Sound" },
                new Category { Name = "Appearance" },
            };
            var words = new List<Word>();

            words.Add(new Word
            {
                Text = "Quick",
                Definition = "Moving fast or doing something in a short time",
                Categories = new List<Category> { categories.First(c => c.Name == "Speed"), categories.First(c => c.Name == "General") },
                Examples = new List<Example> { new Example { Text = "He made a quick decision." } },
                Synonyms = CreateSynonyms(new List<(string, string)>
                {
                    ("Rapid", "Happening in a short time or at a great rate"),
                    ("Swift", "Happening quickly or promptly")
                }, new List<Category> { categories.First(c => c.Name == "Speed"), categories.First(c => c.Name == "General") })
            });

            words.Add(new Word
            {
                Text = "Happy",
                Definition = "Feeling or showing pleasure or contentment",
                Categories = new List<Category> { categories.First(c => c.Name == "Emotions"), categories.First(c => c.Name == "Personality") },
                Examples = new List<Example> { new Example { Text = "She felt happy about her results." } },
                Synonyms = CreateSynonyms(new List<(string, string)>
                {
                    ("Joyful", "Feeling, expressing, or causing great pleasure and happiness"),
                    ("Content", "In a state of peaceful happiness")
                }, new List<Category> { categories.First(c => c.Name == "Emotions"), categories.First(c => c.Name == "Personality") })
            });

            words.Add(new Word
            {
                Text = "Bright",
                Definition = "Giving off lots of light or intelligent",
                Categories = new List<Category> { categories.First(c => c.Name == "Appearance"), categories.First(c => c.Name == "Education") },
                Examples = new List<Example> { new Example { Text = "The room was bright and cheerful." } },
                Synonyms = CreateSynonyms(new List<(string, string)>
                {
                    ("Radiant", "Sending out light; shining or glowing brightly"),
                    ("Vivid", "Producing strong, clear images in the mind")
                }, new List<Category> { categories.First(c => c.Name == "Appearance"), categories.First(c => c.Name == "Education") })
            });

            words.Add(new Word
            {
                Text = "Cold",
                Definition = "Having a low temperature",
                Categories = new List<Category> { categories.First(c => c.Name == "Temperature") },
                Examples = new List<Example> { new Example { Text = "The water was freezing cold." } },
                Synonyms = CreateSynonyms(new List<(string, string)>
                {
                    ("Chilly", "Uncomfortably or unpleasantly cold"),
                    ("Freezing", "Very cold; at or below 0°C (32°F)")
                }, new List<Category> { categories.First(c => c.Name == "Temperature") })
            });

            words.Add(new Word
            {
                Text = "Smart",
                Definition = "Having or showing a quick-witted intelligence",
                Categories = new List<Category> { categories.First(c => c.Name == "Education"), categories.First(c => c.Name == "Personality") },
                Examples = new List<Example> { new Example { Text = "She gave a smart response." } },
                Synonyms = CreateSynonyms(new List<(string, string)>
                {
                    ("Intelligent", "Having or showing intelligence, especially of a high level"),
                    ("Clever", "Quick to understand, learn, and apply ideas")
                }, new List<Category> { categories.First(c => c.Name == "Education"), categories.First(c => c.Name == "Personality") })
            });

            words.Add(new Word
            {
                Text = "Loud",
                Definition = "Producing or capable of producing much noise",
                Categories = new List<Category> { categories.First(c => c.Name == "Sound") },
                Examples = new List<Example> { new Example { Text = "The music was too loud." } },
                Synonyms = CreateSynonyms(new List<(string, string)>
                {
                    ("Noisy", "Making or given to making a lot of noise"),
                    ("Deafening", "So loud as to make it impossible to hear anything else")
                }, new List<Category> { categories.First(c => c.Name == "Sound") })
            });

            words.Add(new Word
            {
                Text = "Clean",
                Definition = "Free from dirt, marks, or stains",
                Categories = new List<Category> { categories.First(c => c.Name == "General"), categories.First(c => c.Name == "Appearance") },
                Examples = new List<Example> { new Example { Text = "The kitchen was clean and tidy." } },
                Synonyms = CreateSynonyms(new List<(string, string)>
                {
                    ("Spotless", "Completely clean"),
                    ("Sanitary", "Hygienic and clean")
                }, new List<Category> { categories.First(c => c.Name == "General"), categories.First(c => c.Name == "Appearance") })
            });

            words.Add(new Word
            {
                Text = "Soft",
                Definition = "Not hard or firm to the touch",
                Categories = new List<Category> { categories.First(c => c.Name == "Appearance") },
                Examples = new List<Example> { new Example { Text = "The blanket is soft and cozy." } },
                Synonyms = CreateSynonyms(new List<(string, string)>
                {
                    ("Cushiony", "Soft and comfortable, like a cushion"),
                    ("Plush", "Soft and luxurious")
                }, new List<Category> { categories.First(c => c.Name == "Appearance") })
            });

            words.Add(new Word
            {
                Text = "Strong",
                Definition = "Having great physical power or strength",
                Categories = new List<Category> { categories.First(c => c.Name == "General"), categories.First(c => c.Name == "Personality") },
                Examples = new List<Example> { new Example { Text = "He is a strong athlete." } },
                Synonyms = CreateSynonyms(new List<(string, string)>
                {
                    ("Powerful", "Having great power or strength"),
                    ("Sturdy", "Strongly and solidly built")
                }, new List<Category> { categories.First(c => c.Name == "General"), categories.First(c => c.Name == "Personality") })
            });

            words.Add(new Word
            {
                Text = "Brave",
                Definition = "Showing courage",
                Categories = new List<Category> { categories.First(c => c.Name == "Personality"), categories.First(c => c.Name == "Emotions") },
                Examples = new List<Example> { new Example { Text = "The firefighter was very brave." } },
                Synonyms = CreateSynonyms(new List<(string, string)>
                {
                    ("Courageous", "Not deterred by danger or pain; brave"),
                    ("Valiant", "Possessing or showing courage or determination")
                }, new List<Category> { categories.First(c => c.Name == "Personality"), categories.First(c => c.Name == "Emotions") })
            });
            words.Add(new Word
            {
                Text = "Slow",
                Definition = "Moving or operating at a low speed",
                Categories = new List<Category> { categories.First(c => c.Name == "Speed") },
                Examples = new List<Example> { new Example { Text = "The traffic was very slow today." } },
                Synonyms = CreateSynonyms(new List<(string, string)>
                {
                    ("Sluggish", "Moving slowly or lazily"),
                    ("Leisurely", "Acting or done at leisure; unhurried")
                }, new List<Category> { categories.First(c => c.Name == "Speed") })
            });

            words.Add(new Word
            {
                Text = "Angry",
                Definition = "Feeling or showing strong annoyance or hostility",
                Categories = new List<Category> { categories.First(c => c.Name == "Emotions") },
                Examples = new List<Example> { new Example { Text = "She was angry at the decision." } },
                Synonyms = CreateSynonyms(new List<(string, string)>
                {
                    ("Furious", "Extremely angry"),
                    ("Irate", "Feeling or characterized by great anger")
                }, new List<Category> { categories.First(c => c.Name == "Emotions") })
            });

            words.Add(new Word
            {
                Text = "Hot",
                Definition = "Having a high degree of heat or a high temperature",
                Categories = new List<Category> { categories.First(c => c.Name == "Temperature") },
                Examples = new List<Example> { new Example { Text = "It was a hot summer day." } },
                Synonyms = CreateSynonyms(new List<(string, string)>
                {
                    ("Scorching", "Very hot"),
                    ("Boiling", "At or near the temperature at which water boils")
                }, new List<Category> { categories.First(c => c.Name == "Temperature") })
            });

            words.Add(new Word
            {
                Text = "Beautiful",
                Definition = "Pleasing the senses or mind aesthetically",
                Categories = new List<Category> { categories.First(c => c.Name == "Appearance") },
                Examples = new List<Example> { new Example { Text = "The sunset was beautiful." } },
                Synonyms = CreateSynonyms(new List<(string, string)>
                {
                    ("Attractive", "Pleasing or appealing to the senses"),
                    ("Lovely", "Exquisitely beautiful")
                }, new List<Category> { categories.First(c => c.Name == "Appearance") })
            });

            words.Add(new Word
            {
                Text = "Ugly",
                Definition = "Unpleasant or repulsive, especially in appearance",
                Categories = new List<Category> { categories.First(c => c.Name == "Appearance") },
                Examples = new List<Example> { new Example { Text = "That building is so ugly." } },
                Synonyms = CreateSynonyms(new List<(string, string)>
                {
                    ("Unattractive", "Not pleasing to look at"),
                    ("Hideous", "Extremely ugly or disgusting")
                }, new List<Category> { categories.First(c => c.Name == "Appearance") })
            });

            words.Add(new Word
            {
                Text = "Wise",
                Definition = "Having or showing experience, knowledge, and good judgment",
                Categories = new List<Category> { categories.First(c => c.Name == "Education"), categories.First(c => c.Name == "Personality") },
                Examples = new List<Example> { new Example { Text = "He is a wise old man." } },
                Synonyms = CreateSynonyms(new List<(string, string)>
                {
                    ("Sage", "A profoundly wise person"),
                    ("Prudent", "Acting with or showing care and thought for the future")
                }, new List<Category> { categories.First(c => c.Name == "Education"), categories.First(c => c.Name == "Personality") })
            });

            words.Add(new Word
            {
                Text = "Innovative",
                Definition = "Featuring new methods or ideas; advanced and original",
                Categories = new List<Category> { categories.First(c => c.Name == "Technology"), categories.First(c => c.Name == "Science") },
                Examples = new List<Example> { new Example { Text = "The company is known for its innovative products." } },
                Synonyms = CreateSynonyms(new List<(string, string)>
                {
                    ("Creative", "Having good imagination or original ideas"),
                    ("Inventive", "Having the ability to create or design new things")
                }, new List<Category> { categories.First(c => c.Name == "Technology"), categories.First(c => c.Name == "Science") })
            });

            words.Add(new Word
            {
                Text = "Loud",
                Definition = "Producing much noise",
                Categories = new List<Category> { categories.First(c => c.Name == "Sound") },
                Examples = new List<Example> { new Example { Text = "The concert was very loud." } },
                Synonyms = CreateSynonyms(new List<(string, string)>
                {
                    ("Ear-splitting", "Extremely loud and harsh-sounding"),
                    ("Thunderous", "Extremely loud")
                }, new List<Category> { categories.First(c => c.Name == "Sound") })
            });

            words.Add(new Word
            {
                Text = "Curious",
                Definition = "Eager to know or learn something",
                Categories = new List<Category> { categories.First(c => c.Name == "Education"), categories.First(c => c.Name == "Personality") },
                Examples = new List<Example> { new Example { Text = "She was curious about everything." } },
                Synonyms = CreateSynonyms(new List<(string, string)>
                {
                    ("Inquisitive", "Curious or inquiring"),
                    ("Questioning", "Showing an interest in learning new things")
                }, new List<Category> { categories.First(c => c.Name == "Education"), categories.First(c => c.Name == "Personality") })
            });

            words.Add(new Word
            {
                Text = "Kind",
                Definition = "Having or showing a friendly, generous, and considerate nature",
                Categories = new List<Category> { categories.First(c => c.Name == "Personality") },
                Examples = new List<Example> { new Example { Text = "He is always kind to others." } },
                Synonyms = CreateSynonyms(new List<(string, string)>
                {
                    ("Compassionate", "Feeling or showing sympathy and concern for others"),
                    ("Friendly", "Kind and pleasant")
                }, new List<Category> { categories.First(c => c.Name == "Personality") })
            });

            context.Words.AddRange(words);
            await context.SaveChangesAsync();
        }

        public static List<Word> CreateSynonyms(List<(string text, string definition)> data, List<Category> categories)
        {
            return data.Select(d => new Word
            {
                Text = d.text,
                Definition = d.definition,
                Categories = categories
            }).ToList();
        }
    }
}

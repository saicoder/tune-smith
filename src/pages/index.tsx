import Head from 'next/head'

import { Configuration, OpenAIApi } from 'openai'
import { useState } from 'react'

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

import { genres, themes } from '../data.json'
import { Navbar } from '@/components/navbar'

const getLineType = (text: string) => {
  const result = text.match(/\[([a-zA-z0-9 ]+)\]/)

  if (result == null) {
    return { type: 'text', data: text } as const
  } else {
    return { type: 'part', data: result[1] } as const
  }
}

const getPrompt = (genre: string, theme: string) => {
  return `Write me a song in ${genre} genre with a theme of ${theme}. Do not output empty lines and output Verse, Outro and Chorus in format [Verse 1], [Outro] etc`
}

export default function Home() {
  const [genre, setGenre] = useState(genres[0])
  const [theme, setTheme] = useState(themes[0])

  const [loading, setLoading] = useState(false)
  const [text, setText] = useState<string>()

  const onGenerate = async () => {
    setLoading(true)
    const prompt = getPrompt(genre, theme)

    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      temperature: 0.6,
      max_tokens: 1024,
    })

    setText(completion.data.choices[0].text || '')
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>TuneSmith</title>
        <meta name="description" content="TuneSmith" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Navbar
          onNewSong={() => {
            setText(undefined)
          }}
        />

        {!loading && !text && (
          <div className="flex flex-col justify-center min-h-screen py-12 bg-gray-100 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
                Write me a song
              </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
              <div className="px-4 py-4 bg-white rounded-md shadow">
                <label htmlFor="option" className="block text-sm font-medium text-gray-700">
                  Genres
                </label>
                <select
                  id="option"
                  name="option"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full px-2 py-2 pl-3 pr-10 mt-1 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  {genres.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <label htmlFor="option" className="block mt-3 text-sm font-medium text-gray-700">
                  About
                </label>
                <select
                  id="option"
                  name="option"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full px-2 py-2 pl-3 pr-10 mt-1 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  {themes.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <button
                  className="w-full px-4 py-2 mt-5 font-bold text-white rounded bg-slate-900 hover:bg-slate-700 focus:outline-none focus:shadow-outline"
                  onClick={onGenerate}
                >
                  Do your Magic
                </button>
              </div>
            </div>
          </div>
        )}

        {!loading && text && (
          <div className="flex flex-col justify-center min-h-screen py-12 bg-gray-100 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
                Here is one:
              </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
              <div className="overflow-hidden bg-white rounded-md shadow">
                {text
                  .split('\n')
                  .filter((t) => t.trim().length !== 0)
                  .map((t, i) => {
                    const { type, data } = getLineType(t)

                    if (type === 'text')
                      return (
                        <div className="px-4 leading-8" key={i}>
                          {data}
                        </div>
                      )
                    if (type === 'part')
                      return (
                        <div
                          className="px-4 py-2 mb-3 font-semibold text-white bg-gray-800"
                          key={i}
                        >
                          {data}
                        </div>
                      )
                  })}
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex flex-col justify-center min-h-screen py-12 bg-gray-100 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-20 h-20 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
              <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
                Working on it
              </h2>
            </div>
          </div>
        )}
      </main>
    </>
  )
}

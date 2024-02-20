'use client'
import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import './contact.css'

export default function Contact(user, validate) {
  // window fadein
  const musicContainer = useRef(null)

  useEffect(() => {
    setTimeout(() => {
      if (musicContainer.current) {
        const container = musicContainer.current
        container.style = 'transition: opacity 2s'
        setTimeout(() => {
          container.style = 'transition: opacity 2s; opacity: 1;'
        }, 1000)
      }
    }, 500)
  }, [musicContainer])

  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  // watch, formState, reset
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const schema = yup
    .object({
      name: yup.string().max(50).required('Please enter your name'),
      email: yup
        .string()
        .max(255)
        .email('Please enter a valid email')
        .required('Please enter a valid email'),
      message: yup.string().max(5000).required('Please enter a message'),
    })
    .required()

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    fetch(`${apiUrl}/form-handler/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        return response.text()
      })
      .then((data) => {
        reset()
        setSuccessMessage(
          'Your message has been sent. You will quickly receive a response.'
        )
      })
      .catch((error) => {
        setErrorMessage('An error has occurred. Please try again later.')
        console.log(error)
      })
  }
  return (
    <section id="Contact" className="contact-container" ref={musicContainer}>
      <h2>CONTACT</h2>
      <div className="contact-separator-up"></div>
      {successMessage && <p className="success">{successMessage}</p>}
      {errorMessage && <p className="error">{errorMessage}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
        <label htmlFor="name">
          Name
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Your name"
            autoComplete="on"
            {...register('name')}
          />
        </label>
        {errors.name && <p className="c-yup">{errors.name.message}</p>}
        <label htmlFor="email">
          E-mail
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Your@email.com"
            autoComplete="on"
            {...register('email')}
          />
        </label>
        {errors.email && <p className="c-yup">{errors.email.message}</p>}
        <label htmlFor="message">
          Message
          <textarea
            id="message"
            name="message"
            placeholder="Your message"
            {...register('message')}
          />
        </label>
        {errors.message && <p className="c-yup">{errors.message.message}</p>}
        <div className="center-btn">
          <button type="submit" className="submit-btn">
            Send
          </button>
        </div>
      </form>
      <div className="contact-separator-down"></div>
    </section>
  )
}

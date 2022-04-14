/*
 * @Author: HuangBoWen
 * @Date: 2022-04-10 15:24:03
 * @LastEditors: HuangBoWen
 * @LastEditTime: 2022-04-11 09:37:55
 * @Description:
 */

import React, { useEffect, useCallback, useState } from 'react'
import styled from 'styled-components'
import { useNavigate, useLocation } from 'react-router-dom'
import { TextField, InputAdornment } from '@mui/material'
import debounce from 'lodash/debounce'
import Search from '@mui/icons-material/Search'
import { Alert, AlertColor, Backdrop, CircularProgress, Snackbar } from '@mui/material'

import { getExploreData, selectExploreStatus } from '../../features/explore/exploreSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'

interface props {}

const InputSearch: React.FC<props> = () => {
  const [value, setValue] = useState<string>(
    new URLSearchParams(window.location.hash.replace('#/', ''))?.get('q') || '',
  )
  // 提示状态
  const [snackbarState, setSnackbarState] = useState<{ open: boolean; alertColor: AlertColor; alertMsg: string }>({
    open: false,
    alertColor: 'info',
    alertMsg: '',
  })
  const exploreNFTStatus = useAppSelector(selectExploreStatus)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const onSearch = (value: string) => {
    // console.log(value, ' ----------------------------- navigate value -----------------------')
    if (value.length !== 0 && value.length < 3) {
      setSnackbarState({
        open: true,
        alertColor: 'warning',
        alertMsg: 'query must have a minimum length of 3 characters',
      })
      return
    }
      navigate(`/?q=${value}`)
      dispatch(getExploreData({}))
  }

  const debouncedSearch = useCallback(
    debounce((value) => onSearch(value), 1000),
    [],
  )

  useEffect(() => {
    debouncedSearch(value)
  }, [value])

  return (
    <Wrapper>
      <TextField
        id="input-with-icon-textfield"
        placeholder="Search NFT"
        className="input-search"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        variant="filled"
        value={value}
        onChange={(e) => setValue(e?.target?.value)}
      />
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={snackbarState.open}
        autoHideDuration={6500}
        onClose={() => setSnackbarState((v) => ({ ...v, open: false }))}
      >
        <Alert severity={snackbarState.alertColor} className="alert-msg">
          {snackbarState.alertMsg}
        </Alert>
      </Snackbar>
    </Wrapper>
  )
}
export default InputSearch
const Wrapper = styled.div`
  margin-right: 20px;
  .input-search {
    width: 260px;
    height: 48px;
    .MuiInputBase-adornedStart {
      border-radius: 0;
      box-shadow: inset 0px 4px 0px rgb(255 255 255 / 25%), inset 0px -4px 0px rgb(0 0 0 / 25%);
    }
    .MuiInputAdornment-filled {
      margin-top: 0 !important;
    }
    input {
      padding-top: 15px;
      padding-bottom: 15.5px;
      font-family: 'PressStart2P-Regular';
      font-size: 12px;
    }
    .MuiInputBase-root {
      &::before {
        border-bottom: 4px solid rgba(0, 0, 0, 0.2);
      }
      &::after {
        border-bottom: 4px solid rgba(0, 0, 0, 0.2);
      }
    }
  }
`
